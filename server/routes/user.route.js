import { Router } from 'express'
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter = Router()

//User Registration Route url : /api/user/register
userRouter.post('/register', registerUserController)

//User Email Verification Route url : /api/user/verify-email
userRouter.post('/verify-email', verifyEmailController)

//User Login Management Route url : /api/user/login
userRouter.post('/login', loginController)

/**
 * User Logout Management 
 * Route url : /api/user/logout
 * First authenticate then logout
 */ 
userRouter.get('/logout', auth, logoutController)

/**
 * User avatar Management 
 * Route url : /api/user/upload-avatar
 * 1.authenticate
 * 2.upload : multer to create storage
 * 3.upload avatar image file
 */
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)

/**
 * Update User Details  
 * Route url : /api/user/update-user
 * 1.authenticate
 * 2.update user details
 */
userRouter.put('/update-user', auth, updateUserDetails)

//forgot-password Route, url : /api/user/forgot-password
userRouter.put('/forgot-password', forgotPasswordController)

//verify forgot password otp Route, url : /api/user/verify-forgot-password-otp
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)

//reset password Route, url : /api/user/reset-password
userRouter.put('/reset-password', resetpassword)

//refresh token Route, url : /api/user/refresh-token
userRouter.post('/refresh-token', refreshToken)

/**
 * Get User Details  
 * Route url : /api/user/user-details
 * 1.authenticate
 * 2.get user details
 */
userRouter.get('/user-details', auth, userDetails)

export default userRouter