import express from "express"
import * as control from "../controllers/postController.js"
import * as controlAuth from "../controllers/authUser.js"
import * as category from '../utils/validator/ValidatePost.js'
const router = express.Router()
// // import { validatorMiddle } from '../middleware/validatorMiddleWare.js'

router.get('/',control.getAllPosts)

router.get('/author/:id',category.getPostValidator,control.getAllPostsForOneAuthor)

router.get('/:id',category.getPostValidator,control.getPostById)

router.post('/secureAdd',controlAuth.protect,category.createPostValidator,control.addPostSecure)

// router.post('/',category.createPostValidator,control.addPost)

router.patch('/update/:id',controlAuth.protect,control.updatePost)

router.delete('/delete/:id',controlAuth.protect,control.deletePost)

router.delete('/deleteAll',controlAuth.protect,controlAuth.permission,control.deleteAllPosts)

export default router