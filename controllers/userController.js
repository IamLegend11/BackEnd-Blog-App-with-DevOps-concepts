import { User } from "../models/db.js"
import { ApiError } from "../utils/apiError.js";
import bcrypt from 'bcrypt'

export const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit
        const users = await User.find().skip(skip).limit(limit);
        return res.status(200).json(users)
    } catch (err) {
        return next(new ApiError("Internal Server Error", 500))
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
            return next(new ApiError("User wasn't found, try again!", 404))
        }
        return res.status(200).json({
            message: "User found successfully",
            user: user
        });
    } catch (err) {
        return next(new ApiError("Something Went wrong", 500))
    }
};

export const getLoggedUserData = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
            return next(new ApiError("User wasn't found, try again!", 404))
        }
        return res.status(200).json({
            message: "User found successfully",
            user: user
        });
    } catch (err) {
        return next(new ApiError("Something Went wrong", 500))
    }
};

export const addUser = async (req, res, next) => {
    try {
        const { name, email, password, age,role } = req.body
        if(password.length < 8 || password.length > 25)
            return res.status(400).json({message:"Password has to be more than 8 chars and less than 25"})

        const user = await User.create({ name, email, age, password,role })
        res.status(201).json({ message: "Added user successfully", user: user })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const { email,name,age } = req.body
        const existingEmail = await User.findOne({email:email})
        
        if (existingEmail) {
            return next(new ApiError("Email already exists", 409))
        }
        const updateUser = await User.findByIdAndUpdate(id, {
            name,
            email,
            age
        },{new:true})
        if (!updateUser) 
            return next(new ApiError("User wasn't found, try again!", 404))

        res.status(200).json({ message: "Updated user successfully", user: updateUser })

    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

export const updatePassword = async (req,res,next) => {
    try {
        const { id } = req.params
        const { newPass } = req.body
        const updateUser = await User.findByIdAndUpdate(id, {
            password: await bcrypt.hash(newPass,10),
            passwordTimeChange:Date.now()
        },{new:true})
        if (!updateUser) 
            return next(new ApiError("User wasn't found, try again!", 404))
        res.status(200).json({ message: "Updated user successfully", user: updateUser })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return next(new ApiError("User wasn't found, try again!", 404))
        }
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

export const getLoggedUser = (req,res,next) => {
    req.params.id = req.user._id
    console.log(req.user._id)
    next()
}

export const updateLoggedUserData = async (req,res,next) => {
    req.user.name = req.body.name || req.user.name
    req.user.email = req.body.email || req.user.email
    req.user.age = req.body.age || req.user.age
    const user = await req.user.save()
    res.status(200).json({ message: "Updated user successfully", user: user })   
}

export const deleteLoggedUser = async (req,res,next) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)
        if (!user) {
            return next(new ApiError("User wasn't found, try again!", 404))
        }
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}