import jwt from 'jsonwebtoken'

const auth = async (request, response, next) => {
    try {
        /**
         * For dekstop application get access token from the cookies
         * For mobile application get access token from the request header
         */
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]
       
        if(!token) {
            return response.status(401).json({
                message: "Access token not available"
            })
        }

        //verify jwt token
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        if(!decode) {
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            })
        }

        //set the user id into the request
        request.userId = decode.id;

        //send the request to the next controller
        next()

    } catch (error) {
        return response.status(500).json({
            message: "Authentication failed", //error.message || error,
            error: true,
            success: false
        })
    }
}

export default auth