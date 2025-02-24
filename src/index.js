import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

// Initialize dotenv
dotenv.config({
    path: './.env'
});

// Initialize Express app
const app = express();

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`⚙️  Server is running at port: ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    });
