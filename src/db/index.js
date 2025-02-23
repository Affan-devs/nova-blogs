import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const connectDB = async() => {
    try {
       const connectionDB = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
        console.log(`MongoDB connect succsesfully: ${connectionDB.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1) // if an error occurs while connecting to the database, 
        // the application will exit with an error code of 1  
    } 
}
export default connectDB