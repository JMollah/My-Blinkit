import mongoose from "mongoose";

/**
 * create order inside the mongo DB
 */
const orderSchema = new mongoose.Schema({
    /**
     * user reference id stored in user_id,
     * reference id comes from user schema
     */
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    //current order id
    orderId: {
        type: String,
        required: [true, "Order Id"],
        unique: true
    },
    /**
     * product reference id stored in product_id,
     * reference id comes from product schema
     */
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product"
    },
    //product details
    product_details: {
        name: String,
        image: Array,
    },
    //payment id
    paymentId: {
        type: String,
        default: ""
    },
    //payment current status
    payment_status: {
        type: String,
        default: ""
    },
    //selected delivery address
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    //partial amount
    subTotalAmt: {
        type: Number,
        default: 0
    },
    //total amount
    totalAmt: {
        type: Number,
        default: 0
    },
    //invoice pdf receipt
    invoice_receipt: {
        type: String,
        default: ""
    }
},{
    //to create createdAt & updatedAt field
    timestamps: true
})

/**
 * Create Order Model ,First one is custom 
 * model name & second one is schema name
 */
const OrderModel = mongoose.model('order', orderSchema)

export default OrderModel