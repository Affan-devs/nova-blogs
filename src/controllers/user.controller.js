import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponce.js";
import { User } from "../models/user.model.js";
import  {Cloudinary} from "../utilis/cloudinary.js"
import { ApiError } from "../utilis/ApiError.js";
const generateAccessandRefreshToken = async(userId) => {
   try {
    const user = await User.findById(userId)   
    const accessToken = user.AccessToken()
    const refreshToken = user.RefreshToken() 

    user.refreshToken = refreshToken
    user.save({validateBeforeSave: false})
   } catch (error) {
    throw new ApiError(500, "Something went wrong")
   }
}
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

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(400, "User already exists")
    }

   // req.files is an object that contains the uploaded files
    // the avatarLocalPath is the first avatar file's path
    // the avatar file is required
    // const avatarLocalPath =  req.files?.avatar?.[0]?.path;
    
    //  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
        let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    console.log("Uploaded files",req.files);
    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar local file is required")
    // }

    // const avatar = await Cloudinary(avatarLocalPath)
    const coverImage = await Cloudinary(coverImageLocalPath)
    console.log("coverImage is:", coverImage);
    
    // if (!avatar) {
    //     throw new ApiError(400, "Cloudinary Avatar file is required")
    // }
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);
    
    res.send("Check server logs!");

    const user = await User.create({
        fullName,
        // avatar: avatar.url,
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
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
   })   

const loginUser = asyncHandler( async (req, res) => {
        // body sa data lay aagi
        // data verify email ya username sa 
        // user find karo 
        // refresh token pass kar day ga

        const {email, password} = req.body

        if(!email){
            throw new ApiError(400, "Email is required")
        }

        const user = await User.findOne({email})
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const PasswordMatch = await user.isPasswordMatch(password);
        if (!PasswordMatch) {
            throw new ApiError(400, "Invalid Password")
        }


        const {accessToken, refreshToken} =  await generateAccessandRefreshToken (user._id)

        const loginUser = await User.findById(user._id)

        // this optionsForCokkies is used to set only server customization for the cookies 
        // "httpOnly" makes that cookies only accessible by the server
        const optionsForCokkies = {
           httpOnly: true,
            secure: true,
            
        }

        // setting cokkies 
    return res.status(200).cokkie("accessToken", accessToken, optionsForCokkies).cokkie("refreshToken", refreshToken, optionsForCokkies)
    .json( 
        new ApiResponce(200,{ user: accessToken, refreshToken,}, "User logged in Successfully")
    )
    })  

const logoutUser = asyncHandler( async (req, res) => {
    // In this code We are taking login user id through req.user (from auth.middleware.js) and setting refresh token to undefined(deleted) 
    // and new means the "refresh token "
    await User.findOneAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options).clearCookie("refreshToken", options)
    .json(new ApiResponce(200, {}, "User logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}