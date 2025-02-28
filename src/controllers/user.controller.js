import { asyncHandler } from "../utilis/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
const registerUser = asyncHandler( async (req, res) => {
    // body sa data lay aagi
    // data verify 
    // password hash
    // user create
    // accese token 
    // login page 

   const {fullName, email, username,password} = req.body
   console.log(email);

   if (
    [fullName, email, username,password].some((fields) =>
    fields?.trim() === "")
   ) {
        throw new ApiError(400, "All fields are required")
   }

  const verifyUser = await User.findOne({email})

  if (verifyUser) {
      throw new ApiError(400, "User email already exist")
  }

   const avatarLocal = req.files?.avatar[0]?.path;
   const  coverImageLocal = req.files?.coverImage[0]?.path;

   if (!avatarLocal) {
    throw new ApiError(400, "Avatar is required")
   }

   }

)

export {
    registerUser,
}