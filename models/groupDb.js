import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
        maxlength: 30
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    permissions: [
        {
            type:String,
            enum:["read","write","r&w"],
            default:"read"
        }
    ]
    
}, { timestamps: true })



export const Group = mongoose.model('Group', groupSchema)

