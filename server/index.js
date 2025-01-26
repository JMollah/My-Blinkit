import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './routes/user.route.js'
import categoryRouter from './routes/category.route.js'
import uploadRouter from './routes/upload.router.js'
import subCategoryRouter from './routes/subCategory.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import addressRouter from './routes/address.route.js'
import orderRouter from './routes/order.route.js'

const app = express()

//middleware
app.use(cors({
    //to access the cookies from the client side
    credentials: true,
    /**
     * dotenv package will help to get 
     * FRONTEND_URL from .env file
     */
    origin: process.env.FRONTEND_URL
}))

//to handle the json response 
app.use(express.json())
//to handle cookies
app.use(cookieParser())
//HTTP request logger middleware
app.use(morgan())
//set HTTP response headers
app.use(helmet({
    /**
     * Because frontend and backend origin
     * are differt, so setting it false 
     */
    crossOriginResourcePolicy : false
}))

/**
 * if 8080 port is busy then it will
 * automatically use another port
 */
const PORT = 8080 || process.env.PORT 

// run on the '/' server
app.get("/", (req, res) => {
    //server to client
    res.json({
        message : "Server is running " + PORT
    })
})

//entry point of userRouter, url: /api/user
app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)

/**
 * first connect to the mongo DB server 
 * then go ahead to the localhost server
 */
connectDB().then(() => {
    /**
     * run on the localhost server
     * ex: http://localhost:8080
     */
    app.listen(PORT, () => {
        console.log("Server is running at Port : " + PORT)
    })
})