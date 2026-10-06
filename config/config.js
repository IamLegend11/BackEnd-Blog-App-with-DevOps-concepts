import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const mongConnection = () => {
    mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log('Connected to MongoDB')
    })
}