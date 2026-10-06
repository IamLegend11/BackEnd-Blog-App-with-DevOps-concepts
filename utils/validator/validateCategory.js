import { check, param } from 'express-validator'
import { validatorMiddle } from '../../middleware/validatorMiddleWare.js'
import { User } from '../../models/db.js'
import bcrypt from 'bcrypt'
import { ApiError } from '../apiError.js'

export const getUserValidator = [
    check('id').isMongoId().withMessage("Wrong Id,try again!!!"), validatorMiddle
]

export const createUserValidator = [
    check('name').notEmpty()
        .withMessage("Need to add a name")
        .isAlpha()
        .withMessage("Name has to be a string")
        .isLength({ min: 3 })
        .withMessage("Name has to be at least 3 chars"),
    check('email').notEmpty().withMessage("Need to provide an E-mail")
        .isEmail().withMessage("Enter valid E-mail format").custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new ApiError('E-mail must be unique.try again!', 400);
            }
            return true;
        }),
    check('password').notEmpty().withMessage("Password has to be entered")
        .isLength({ min: 8 }).withMessage("Has to be 8 chars at least").custom((val, { req }) => {
            if (val !== req.body.passConf)
                throw new ApiError("Password has to match,try again!", 400)
            return true
        }),
    check('passConf').notEmpty().withMessage("Has to enter pass confirmation"),
    check('age').optional().isNumeric().withMessage("Has to be a number")
        .custom((age) => {
            if (age > 99 || age < 18)
                throw new ApiError("Age is invalid,try to be above 18 and under 99", 400)
            return true
        }),
    check('role').optional(), validatorMiddle
]

export const deleteUserValidator = [
    check('id').isMongoId().withMessage("Wrong Id,try again!"), validatorMiddle
]

export const updateUserValidator = [
    check('id').isMongoId().withMessage("Wrong Id,try again!"), validatorMiddle
]

export const updatePasswordValidator = [
    param('id').isMongoId().withMessage("Wrong Id,try again!"),
    check('password').notEmpty().withMessage("must provide password").custom((pass, { req }) => {
        if (req.body.password === req.body.newPass)
            throw new ApiError("Password already exists,try to add a new one")
        return true
    }), check('newPass').notEmpty().withMessage("New Password has to be entered")
        .isLength({ min: 8 }).withMessage("Has to be 8 chars at least").custom(async (newPass, { req }) => {
            const user = await User.findById(req.params.id)
            const isCorrect = await bcrypt.compare(req.body.password, user.password)
            if (!isCorrect)
                throw new ApiError("Current password isn't matching")
            if (newPass !== req.body.newPassConf)
                throw new ApiError("New password has to match,try again!")
            return true
        }), check("newPassConf").notEmpty().withMessage("Confirmation of the New Password has to be entered"), validatorMiddle
]

export const logInValidator = [
    check('email').notEmpty().withMessage("Need to provide an E-mail")
        .isEmail().withMessage("Enter valid E-mail format"),
    check('password').notEmpty().withMessage("Password has to be entered")
        .isLength({ min: 8 }).withMessage("Has to be 8 chars at least"), validatorMiddle
]

export const resetValidator = [
    check('email').notEmpty().withMessage("Need to provide an E-mail")
        .isEmail().withMessage("Enter valid E-mail format").custom(async (email, { req }) => {
            const user = await User.findOne({ email: req.body.email })
            if (user.resetVerify === false)
                throw new ApiError("Anything", 401)
            if (!user)
                throw new ApiError("User wasn't found,try again", 404)
            return true
        }),
    check('password').notEmpty().withMessage("must provide password").custom(async (pass, { req }) => {
        const user = await User.findOne({ email: req.body.email })
        const isCorrect = await bcrypt.compare(pass, user.password)
        if (!isCorrect)
            throw new ApiError("Old password isn't matching,try again!", 400)
        if (pass === req.body.newPassword)
            throw new ApiError("Password already exists,try to add a new one")
        return true
    }), check('newPassword').notEmpty()
        .isLength({ min: 8 }).withMessage("Has to be 8 chars at least").custom((newPass, { req }) => {
            if (newPass !== req.body.newPassConf)
                throw new ApiError("New password has to match,try again!")
            return true
        }), check("newPassConf").notEmpty().withMessage("Confirmation of the New Password has to be entered"), validatorMiddle
]