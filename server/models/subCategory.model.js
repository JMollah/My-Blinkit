import mongoose from "mongoose";

/**
 * create sub category inside the mongo DB
 */
const subCategorySchema = new mongoose.Schema({
    //sub category name
    name: {
        type: String,
        default: ""
    },
    //sub category image url
    image: {
        type: String,
        default: ""
    },
    /**
     * category reference id stored in category,
     * reference id comes from category schema
     */
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "category"
        }
    ]
},{
    //to create createdAt & updatedAt field
    timestamps: true
})

/**
 * Create sub category Model ,First one is custom 
 * model name & second one is schema name
 */
const SubCategoryModel = mongoose.model('subCategory', subCategorySchema)

export default SubCategoryModel