import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import  {Cloudinary} from "../utilis/cloudinary.js"
import { ApiResponce } from "../utilis/ApiResponce.js";
const registerUser = asyncHandler( async (req, res) => {
    // body sa data lay aagi
    // data verify 
    // password hash
    // user create
    // accese token 
    // login page 

    const {fullName, email, username, password } = req.body
    // console.log("email:", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await  User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(400, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar local file is required")
    }

    const avatar = await Cloudinary(avatarLocalPath)
    const coverImage = await Cloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Cloudinary Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponce(200, createdUser, "User registered Successfully")
    )
   })   


export {
    registerUser,
}