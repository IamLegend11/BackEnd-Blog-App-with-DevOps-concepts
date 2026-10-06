import jwt from 'jsonwebtoken'
import { User } from "../models/db.js"
import crypto from 'crypto'
import { ApiError } from "../utils/apiError.js";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { sendEmail } from "../utils/sendEmail.js"
dotenv.config({ path: './.env' })

export const signUp = async (req, res, next) => {
    const { name, password, email, age } = req.body
    const role = req.body.role || "user"
    const user = await User.create({
        name, password, email, age, role
    })

    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_DATE })

    return res.status(201).json({ user, token })
}

export const logIn = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user)
        return res.status(404).json({ message: "User wasn't able to find I<" })
    const comparePass = await bcrypt.compare(password, user.password)
    if (!comparePass)
        return res.status(401).json({ message: "Failed to login,try again!" })
    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_DATE })
    res.status(200).json({ message: "successfully logged in ", token })
}

export const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(new ApiError('Failed to authorize', 401));
    }
    const token = authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id)
        if (!user)
            return next(new ApiError("Failed to find user,try again", 404))

        if (user.passwordTimeChange) {
            const timeUpdate = parseInt(user.passwordTimeChange.getTime() / 1000)
            if (timeUpdate > decoded.iat) {
                return next(new ApiError("Password was changed, kindly log-in again.", 401))
            }
        }

        req.user = user
        next()

    } catch (error) {
        next(new ApiError("Failed to authorize.", 500))
    }
}

export const permission = async (req, res, next) => {
    const { role } = req.user
    if (!role || role !== "admin")
        return next(new ApiError("You're not allowed to edit.", 403))
    return next()
}

export const forgotPassword = async (req, res, next) => {

    const resetCode = parseInt(Math.random() * 1000000);

    const user = await User.findOne({
        email: req.body.email
    });

    if (!user)
        return res.status(404).json({
            message: "email doesn't exist"
        });

    const hashedCode = crypto
        .createHash('sha256')
        .update(resetCode.toString())
        .digest('hex');

    user.codeExpiry = Date.now() + 10 * 60 * 1000;
    user.resetVerify = false;
    user.resetCode = hashedCode;
    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: "Reset Password",
            message: `Your reset code is ${resetCode}`
        });
    } catch (err) {
        user.resetCode = undefined;
        user.codeExpiry = undefined;
        user.resetVerify = undefined;
        await user.save();
        return next(
            new ApiError(
                "Failed to send reset code,try again later",
                500
            )
        );
    }
    res.status(200).json({
        message: "Reset code sent to the e-mail, kindly check", resetCode
    });
};

export const verifyResetCode = async (req, res, next) => {
    const hashCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode.toString())
        .digest('hex');
    const user = await User.findOne({ resetCode: hashCode, codeExpiry: { $gt: Date.now() } })
    if (!user)
        return next(new ApiError("User wasn't found or reset code isn't correct,try again later!", 401))
    user.resetVerify = true
    await user.save()
    res.status(200).json({ message: "Code verified successfully", user })
}

export const resetPassword = async (req, res, next) => {
    try {
        const { newPassword, email } = req.body
        const user = await User.findOne({ email: email })
        user.password = await bcrypt.hash(newPassword, 10),
        user.passwordTimeChange = Date.now()
        user.resetVerify = false
        user.resetCode = undefined;
        user.codeExpiry = undefined;
        const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_DATE })
        await user.save()
        res.status(201).json({ message: "Password reset successfully", user ,token:token})

    } catch (error) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
} 

