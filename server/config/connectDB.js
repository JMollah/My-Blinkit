import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

//Validate MONGODB_URI inside .env file
if(!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not available, Please provide MONGODB_URI inside the .env file")
}

/**
 * Connecting to the server takes time. 
 * So makes it asynchronious
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Successfully connected to Mongo DB Server")
    } catch (error) {
        console.log("Mongo DB connection falied", error)
        process.exit(1)
    }
}

export default connectDB