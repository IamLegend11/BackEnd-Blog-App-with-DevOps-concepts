import { check } from 'express-validator'
import { validatorMiddle } from '../../middleware/validatorMiddleWare.js'

export const getPostValidator = [
    check('id').isMongoId().withMessage("Wrong Id,try again!"),validatorMiddle
]

export const createPostValidator = [
    check('title').notEmpty().withMessage("Must include title"),
    check('content').notEmpty().withMessage("Must include content,try again!"),validatorMiddle
]

export const deletePostValidator = [
    check('id').isMongoId().withMessage("Wrong Id,try again!"),validatorMiddle
]

export const updatePostValidator = [
    check('id').isMongoId().withMessage("Wrong Id,try again!"),validatorMiddle
]