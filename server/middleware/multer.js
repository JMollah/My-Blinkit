import multer from 'multer'

//temporary storage
const storage = multer.memoryStorage()

/**
 * Multer is a node.js middleware for handling multipart/form-data, 
 * which is primarily used for uploading files.
 */
const upload = multer({ storage: storage })

export default upload