import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type:String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, "Can't be empty!"],
        trim: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    images: [String]
}, { timestamps: true })

//Create Model
export const Post = mongoose.model('Post', postSchema)

