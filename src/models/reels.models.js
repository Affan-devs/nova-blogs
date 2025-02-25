import mongoose, {Schema} from "mongoose";

const reelSchema = new Schema(
    {
        videoFile: {
            type: String, 
            required: true
        },
        thumbnail: {
            type: String, 
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true,
            trim: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        videoUrl: {
                type: String,
                required: true
            },

    },
 {timestamps: true})


export const Reel = mongoose.model("Reel", reelSchema)