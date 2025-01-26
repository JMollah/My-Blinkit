import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcrypt from 'bcrypt'
import registrationEmailTemplate from '../utils/registrationEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageClodinary from '../utils/uploadImageClodinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'

/**
 * Register new User & send email to the user
 * @param {request} req 
 * @param {response} res 
 * @returns User Registration Message
 */
export const registerUserController = async (req, res) => {
    try {
        //spread user information
        const { name, email, password } = req.body;

        /**
         * if name or email or password 
         * not available then return error
         */
        if(!name || !email || !password) {
            return res.status(400).json({
                message: "Name, Email & Password Can't be blank",
                error: true,
                success: false
            })
        }

        //find user info using email inside the DB
        const user = await UserModel.findOne({ email })

        /**
         * if Email Already Registered, 
         * then return error
         */
        if(user) {
            return res.json({
                message: "Email Already Registered, Please use different Email",
                error: true,
                success: false
            })
        }

        /**
         * encrypt the password using salt &
         * store the encrypted password
         */
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        //creat payload using user basic information
        const payload = {
            name,
            email,
            password: hashPassword
        }

        /**
         * create new user using basic details &
         * save inside the mongo DB
         */
        const newUser = new UserModel(payload)
        const save = await newUser.save()

        //verifying email
        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        //send email to the user
        await sendEmail({
            sendTo: email,
            subject: "My Blinkit Email verification",
            //Registration Email Template
            html: registrationEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })

        //return success message
        return res.json({
            message: "User Registration Successfull",
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * Validate Email of the User
 * @param {request} req 
 * @param {response} res 
 * @returns Email Verification Message
 */
export const verifyEmailController = async (req, res) => {
    try {
        //verify email id
        const { code } = req.body;

        //find user inside the DB
        const user = await UserModel.findOne({ _id: code})

        //if user does not exist return error
        if(!user) {
            return res.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            })
        }

        //update verify_email field
        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })
        await updateUser.save()

        return res.json({
            message: "Email Verification Completed:)",
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * Manage Login Operation
 * set cookies to the request
 * @param {request} req 
 * @param {response} res 
 * @returns Login Message
 */
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email or Password Can't be Empty",
                error: true,
                success: false
            })
        }

        //find user from DB
        const user = await UserModel.findOne({ email })

        //user existance check
        if(!user) {
            return res.status(400).json({
                message: "Something went wrong, Please check your user name or password",
                error: true,
                success: false
            })
        }

        //only active user can Login
        if(user.status !== "Active") {
            return res.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
            })
        }

        //compare both the password
        const checkPassword = await bcrypt.compare(password, user.password)

        //validating user password
        if(!checkPassword) {
            return res.status(400).json({
                message: "Something went wrong, Please check your user name or password",
                error: true,
                success: false
            })
        }

        //access token is used for login purpose, valid for 5h
        const accesstoken = await generatedAccessToken(user._id)
        //update refresh token to the user, valid for 7d
        const refreshToken = await genertedRefreshToken(user._id)

        //update user last login date
        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })
        await updateUser.save()

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        //set cookies to the server
        res.cookie('accessToken', accesstoken, cookiesOption)
        res.cookie('refreshToken', refreshToken, cookiesOption)

        return res.json({
            message: "Login Successfull",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * Manage Logout Operation
 * remove cookies from the request &
 * set refresh token empty
 * @param {request} req 
 * @param {response} res 
 * @returns Logout Message
 */
export const logoutController = async (req, res) => {
    try {
        //userId come from auth middleware
        const userId = req.userId;

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        //remove cookies from the user context
        res.clearCookie("accessToken", cookiesOption)
        res.clearCookie("refreshToken", cookiesOption)

        //set refresh token empty
        await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })

        return res.json({
            message: "Logout successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * Manage Logout Operation
 * remove cookies from the request &
 * set refresh token empty
 * @param {request} req 
 * @param {response} res 
 * @returns Profile image upload Message
 */
export const uploadAvatar = async (req, res) => {
    try {
        //userId come from auth middleware
        const userId = req.userId
        //file come from multer middleware
        const image = req.file

        //uploading image to the clodinary
        const upload = await uploadImageClodinary(image)
        
        //update user profile image
        await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return res.json({
            message: "Profile image successfully uploded",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * Update User name, email, mobile no, password
 * @param {request} req 
 * @param {response} res 
 * @returns Updated JSON
 */
export const updateUserDetails = async (req, res) => {
    try {
        //userId come from auth middleware
        const userId = req.userId;
        const { name, email, mobile, password } = req.body;

        let hashPassword = ""

        //create encrypted password
        if(password) {
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password, salt)
        }

        /**
         * Update User name, email, mobile no, password
         * if not empty or null
         */
        const updateUser = await UserModel.updateOne({ _id: userId}, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
        })

        return res.json({
            message: "Updated Successfully",
            error: false,
            success: true,
            data: updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * 1.Verify user using email
 * 2.generate otp
 * 3.update otp & otp expire time inside db
 * 4.send otp
 * @param {request} req 
 * @param {response} res 
 * @returns response message
 */
export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        //find user
        const user = await UserModel.findOne({ email })

        //verify user
        if(!user){
            return res.status(400).json({
                message: "Can't find the Email",
                error: true,
                success: false
            })
        }

        //generate 6-digit random otp
        const otp = generatedOtp()
        const expireTime = new Date() + 10 * 60 * 1000  //10m

        //update otp and otp expire time[10m] inside db
        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        //send email to the user
        await sendEmail({
            sendTo: email,
            subject: "Forgot password from Binkeyit!",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return res.json({
            message: "Please Check your email for OTP",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * 1.Verify user using email
 * 2.otp expire time = 10min 
 * 3.validate otp
 * 4.reset forgot_password_otp & forgot_password_expiry field
 * @param {request} req 
 * @param {response} res 
 * @returns response message
 */
export const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if(!email || !otp) {
            return res.status(400).json({
                message: "Email & otp can't be empty",
                error: true,
                success: false
            })
        }

        //find user using email
        const user = await UserModel.findOne({ email })

        //verify user
        if(!user) {
            return res.status(400).json({
                message: "Can't find the Email",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()

        //after 10min otp will expire
        if(user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "Otp expired",
                error: true,
                success: false
            })
        }

        //validate otp
        if(otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "Invalid otp",
                error: true,
                success: false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        //reset forgot_password_otp & forgot_password_expiry
        await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        })
        
        return res.json({
            message: "OTP verification successful",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * 1.Verify user using email
 * 2.compare new password & confirm password
 * 3.store new password inside the db
 * @param {request} req 
 * @param {response} res 
 * @returns response message
 */
export const resetpassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if(!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user) {
            return res.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "newPassword and confirmPassword must be same",
                error: true,
                success: false,
            })
        }

        //encrypt new password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        //update user password
        await UserModel.findOneAndUpdate(user._id, {
            password: hashPassword
        })

        return res.json({
            message: "Password updated successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * 1.Verify refresh token
 * 2.get user id from refresh token
 * 3.generate new access token
 * 4.set access token inside the season
 * @param {request} req 
 * @param {response} res 
 * @returns response message
 */
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken) {
            return res.status(401).json({
                message: "Invalid Refresh Token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken) {
            return res.status(401).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id

        //generating new access token
        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        //set access token inside the season
        res.cookie('accessToken', newAccessToken, cookiesOption)

        return res.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

/**
 * 1.get user id from the request
 * 2.logged in user details
 * @param {request} req 
 * @param {response} res 
 * @returns response message
 */
export const userDetails = async (req, res) => {
    try {
        //userId come from auth middleware
        const userId  = req.userId;

        /**
         * remove password & refresh_token 
         * from the user response
         */
        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return res.json({
            message: 'User details',
            data: user,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false
        })
    }
}