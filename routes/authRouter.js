import express from "express"
import * as control from "../controllers/authUser.js"
import * as category from '../utils/validator/validateCategory.js'
const router = express.Router()

router.post('/signup', category.createUserValidator, control.signUp)

router.post('/login', category.logInValidator, control.logIn)

router.get('/protect', control.protect, (req, res) => {
    res.status(200).json({
        message: 'Access granted',
        user: req.user
    });
})

router.post('/forgotPassword',control.forgotPassword)

router.post('/verifyCode',control.verifyResetCode)

router.put('/resetPass',category.resetValidator,control.resetPassword)

export default router