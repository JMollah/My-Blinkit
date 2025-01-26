import mongoose from "mongoose"

/**
 * create user inside the mongo DB
 */
const userSchema = new mongoose.Schema({
    //user name
    name: {
        type: String,
        required: [true, "User Name"]
    },
    //user email
    email: {
        type: String,
        required: [true, "User Email"],
        unique: true
    },
    //user encrypted password
    password: {
        type: String,
        required: [true, "User Password"]
    },
    //user avatar url 
    avatar: {
        type: String,
        default: ""
    },
    //user mobile number
    mobile: {
        type: Number,
        default: null
    },
    /**
     * At the time of login refresh token generated
     * After logout it was removed
     */
    refresh_token: {
        type: String,
        default: ""
    },
    /**
     * user email verification
     * dafault: false
     */
    verify_email: {
        type: Boolean,
        default: false
    },
    /**
     * last login Date
     * value: Current Date
     */
    last_login_date: {
        type: Date,
        default: ""
    },
    /**
     * user current status
     * default: Active
     */
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    /**
     * address reference id stored in address_details,
     * reference id comes from address schema
     */
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'address'
        }
    ],
    /**
     * product reference id stored in shopping_cart,
     * reference id comes from cartProduct schema
     */
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'cartProduct'
        }
    ],
    /**
     * order history reference id stored in order_history,
     * reference id comes from order schema
     */
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ],
    /**
     * If user forgot password then a otp will send to 
     * users registed mobile no or email to reauthenticate
     */
    forgot_password_otp: {
        type: String,
        default: null
    },
    /**
     * If user forgot password then a otp will send to 
     * users registed mobile no or email to reauthenticate
     * this otp will valid for limited time 
     */
    forgot_password_expiry: {
        type: Date,
        default: ""
    },
    /**
     * user role to provide access
     * ADMIN - All Access
     * USER - Limited access (default)
     */
    role: {
        type: String,
        enum: ['ADMIN', "USER"],
        default: "USER"
    }
},{
    //to create createdAt & updatedAt field
    timestamps: true
})


/**
 * Create User Model ,First one is custom 
 * model name & second one is schema name
 */
const UserModel = mongoose.model("User", userSchema)

export default UserModel