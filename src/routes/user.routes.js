
import { Router } from "express";
import { logoutUser, registerUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/mullter.middleware.js";
import { verifyJWTforLogout } from "../middleware/auth.middleware.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage", 
            maxCount: 1
        }
    ]),
    registerUser
    )
    
router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWTforLogout, logoutUser)

export default router
