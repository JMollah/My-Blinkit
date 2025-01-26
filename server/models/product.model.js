import mongoose from "mongoose";

/**
 * create product inside the mongo DB
 */
const productSchema = new mongoose.Schema({
    //product name
    name: {
        type: String,
    },
    //product image array
    image: {
        type: Array,
        default: []
    },
    /**
     * category reference id stored in category,
     * reference id comes from category schema
     */
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ],
    /**
     * sub category reference id stored in sub_category,
     * reference id comes from subCategory schema
     */
    subCategory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory'
        }
    ],
    //user selected product count
    unit: {
        type: String,
        default: ""
    },
    //total count of the product
    stock: {
        type: Number,
        default: null
    },
    //product price
    price: {
        type: Number,
        defualt: null
    },
    //product discount
    discount: {
        type: Number,
        default: null
    },
    //product details
    description: {
        type: String,
        default: ""
    },
    //product additional details
    more_details: {
        type: Object,
        default: {}
    },
    //product published
    publish: {
        type: Boolean,
        default: true
    }
},{
    //to create createdAt & updatedAt field
    timestamps: true
})

//create a text index
productSchema.index({
    name: "text",
    description: 'text'
},{
    name: 10,
    description: 5
})

/**
 * Create Product Model ,First one is custom 
 * model name & second one is schema name
 */
const ProductModel = mongoose.model('product', productSchema)

export default ProductModel