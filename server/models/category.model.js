import mongoose from "mongoose";

/**
 * category product inside the mongo DB
 */
const categorySchema = new mongoose.Schema({
    //category name
    name: {
        type: String,
        default: ""
    },
    //category image url
    image: {
        type: String,
        default: ""
    }
},{
    //to create createdAt & updatedAt field
    timestamps: true
})

/**
 * Create Category Model ,First one is custom 
 * model name & second one is schema name
 */
const CategoryModel = mongoose.model('category', categorySchema)

export default CategoryModel