import mongoose from "mongoose";

/**
 * create cart product inside the mongo DB
 */
const cartProductSchema = new mongoose.Schema({
    /**
     * product reference id stored in product_id,
     * reference id comes from product schema
     */
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    },
    //cart product quantity
    quantity: {
        type: Number,
        default: 1
    },
    /**
     * user reference id stored in user_id,
     * reference id comes from user schema
     */
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
},{
    //to create createdAt & updatedAt field
    timestamps: true
})

/**
 * Create Cart Product Model ,First one is custom 
 * model name & second one is schema name
 */
const CartProductModel = mongoose.model('cartProduct', cartProductSchema)

export default CartProductModel