import express from "express"
import * as control from "../controllers/userController.js"
// import { param } from 'express-validator'
import * as category from '../utils/validator/validateCategory.js'
import * as auth from '../controllers/authUser.js'
// import { validatorMiddle } from '../middleware/validatorMiddleWare.js'
const router = express.Router()


router.get('/',control.getAllUsers)

router.put('/changePass/:id',category.updatePasswordValidator,control.updatePassword)

router.get('/:id',category.getUserValidator,control.getUserById)

router.post('/',category.createUserValidator,control.addUser)

router.patch('/:id',category.updateUserValidator,control.updateUser)

router.delete('/:id',category.deleteUserValidator,control.deleteUser)

router.use(auth.protect)

router.put('/updateLoggedUser',control.updateLoggedUserData)

router.get('/getLoggedUser',control.getLoggedUser,control.getLoggedUserData)

export default router