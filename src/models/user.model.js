import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowecase: true, 
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, 
            // required: true,
        },
        coverImage: {
            type: String, 
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre('save', function(next) {
    if(!this.isModified('password')) return next();

    this.password = bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordMatch = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.AccessToken = function() {
    return jwt.sign=(
     {
        _id: this._id,
        username: this.username,
        email: this.email,
        },
    process.env.ACCESS_TOKEN,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
}
    )
}

userSchema.methods.RefreshToken = function() {
    jwt.sign=(
     {
        _id: this._id,
    },
    process.env.REFERSH_TOKEN,
{
    expiresIn: process.env.REFERSH_TOKEN_EXPIRY
        }
     )
    }
 export const  User = mongoose.model(`users`, userSchema)