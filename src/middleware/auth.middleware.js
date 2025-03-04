import { ApiError } from "../utilis/ApiError.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const verifyJWTforLogout = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // Cookies (req.cookies?.accessToken) → Used if the frontend stores tokens in cookies.
        // Authorization Header (req.header("Authorization")?.replace("Bearer ", "")) 
        //  Used if the frontend sends tokens in the HTTP headers.
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN)
    // The token is verified using the secret key stored in .env (ACCESS_TOKEN_SECRET).
    // If the token is invalid or expired, jwt.verify will throw an error.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    // The _id from the decoded token is used to find the user in the database.
    // select("-password -refreshToken") excludes sensitive fields (password and refreshToken) from the result.
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        // The user details are added to req.user so other parts of the application (controllers, route handlers) can access them.
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

export {verifyJWTforLogout}