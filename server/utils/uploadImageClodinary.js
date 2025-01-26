import { v2 as cloudinary } from 'cloudinary';

//set clodinary configuration
cloudinary.config({
    cloud_name : process.env.CLODINARY_CLOUD_NAME,
    api_key : process.env.CLODINARY_API_KEY,
    api_secret : process.env.CLODINARY_API_SECRET_KEY
})

//upload image inside clodinary
const uploadImageClodinary = async (image) => {
    //convert image to the buffer
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve, reject) => {
        //upload the image inside blinkit folder
        cloudinary.uploader.upload_stream(
            { folder: "blinkit" }, 
            ( error, uploadResult ) => {
                return resolve(uploadResult)
            }
        ).end(buffer)
    })

    return uploadImage
}

export default uploadImageClodinary
