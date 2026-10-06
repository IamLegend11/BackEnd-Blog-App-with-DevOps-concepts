import express from "express"
import * as control from "../controllers/groupController.js"
import * as auth from '../controllers/authUser.js'
// import * as category from '../utils/validator/validateCategory.js'
// import { validatorMiddle } from '../middleware/validatorMiddleWare.js'
const router = express.Router()


router.get('/',control.getAllGroups)

router.post('/',auth.protect,auth.permission,control.createGroup)

router.put('/addUser',auth.protect,auth.permission,control.addUserToGroup)

router.delete('/deleteUser',auth.protect,auth.permission,control.removeUserFromGroup)

router.patch('/updatePermission',auth.protect,auth.permission,control.updateGroupPermission)

export default router
