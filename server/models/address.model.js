import mongoose from "mongoose";

/**
 * create address inside the mongo DB
 */
const addressSchema = new mongoose.Schema({
    //user address
    address_line: {
        type: String,
        default: ""
    },
    //user city name
    city: {
        type: String,
        default: ""
    },
    //user state name
    state: {
        type: String,
        default: ""
    },
    //user pincode
    pincode: {
        type: String
    },
    //user country name
    country: {
        type: String
    },
    //user mobile number
    mobile: {
        type: Number,
        default: null
    },
    /**
     * If user delete any address then 
     * we will mark that address as false
     * existing address value is true
     */
    status: {
        type: Boolean,
        default: true
    },
    /**
     * user reference id stored in user_id,
     * reference id comes from user schema
     */
    userId: {
        type: mongoose.Schema.ObjectId,
        default: ""
    }
},{
    //to create createdAt & updatedAt field
    timestamps: true
})

/**
 * Create Address Model ,First one is custom 
 * model name & second one is schema name
 */
const AddressModel = mongoose.model('address', addressSchema)

export default AddressModel