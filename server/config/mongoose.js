import mongoose from "mongoose";


export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Connected with MongoDB".cyan.underline)
    } catch (err) {
        console.log(`Unable to connect with MongoDB ${err.message}`.red.bold )
        process.exit()
    }
}