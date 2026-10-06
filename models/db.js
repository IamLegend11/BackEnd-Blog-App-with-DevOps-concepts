import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"]
    },
    age: Number,
    password: {
        type: String,
        required: [true,"Password is required"],
        minlength: 8
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    passwordTimeChange:Date,
    resetCode:String,
    codeExpiry: Date,
    resetVerify: Boolean
}, { timestamps: true })


userSchema.pre('save',async function(){
    if(!this.isModified('password'))
        return 
    this.password = await bcrypt.hash(this.password,10)
})
//Create Model
export const User = mongoose.model('User', userSchema)

