import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({

    followers: {
        tyoe: Schema.Types.ObjectId,
        ref: "User"
    },
    page: {
        type: Schema.Types.ObjectId,
        ref: "Page"
    }

},{timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)