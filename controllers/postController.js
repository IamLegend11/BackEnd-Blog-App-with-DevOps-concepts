import { User } from "../models/db.js"
import { Post } from "../models/postDb.js";
import { Group } from "../models/groupDb.js";
import { ApiError } from "../utils/apiError.js";
import bcrypt from 'bcrypt'

export const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit
        return res.status(200).json({ Posts: await Post.find().skip(skip).limit(limit).sort({ createdAt: -1 }) });
    } catch (err) {
        console.error(err)
        return next(new ApiError("Internal Server Error", 500))
    }
}

export const addPost = async (req, res, next) => {
    try {
        const { author, title, content, images } = req.body
        if (!author || !title || !content) {
            return res.status(400).json({
                message: 'Author, title, and content are required.'
            });
        }
        if (! await User.findOne({ _id: author }))
            return res.status(404).json({ message: "Author you entered doesn't exist" });
        if (await Post.findOne({ title }))
            return res.status(400).json({ message: 'Title has to be unique' });
        const post = await Post.create({ author, title, content, images: images ?? [] })
        res.status(201).json({ message: "Post added successfully!", post })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

export const addPostSecure = async (req, res, next) => {
    try {
        const { title, content, images } = req.body
        const groupId = req.body.groupId || "No Group"
        const author = req.user._id
        if (await Post.findOne({ title }))
            return res.status(400).json({ message: 'Title has to be unique' });
        if (groupId !== "No Group") {
            const group = await Group.findById(groupId)
            if (!group)
                return next(new ApiError("Group wasn't found, try again!", 404))
            if (!group.members.includes(author.toString()) && !group.admins.includes(author.toString()))
                return next(new ApiError("Member wasn't found or you're not part of the group, try again!", 404))
            const index = group.members.indexOf(author.toString())
            console.log("Index:", index)
            if (!group.admins.includes(author.toString())) {
                if (group.permissions[index] !== "r&w" && group.permissions[index] !== "write")
                    return next(new ApiError("You are not allowed to create a post!", 403))
            }
        }
        if(groupId === "No Group")
        {
            const post = await Post.create({ author, title, content, images: images ?? [] })
            return res.status(201).json({ message: "Post added successfully!", post })
        }
        const post = await Post.create({ author, title, content, images: images ?? [], group: groupId })
        return res.status(201).json({ message: "Post added successfully!", post })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const { title, content, images } = req.body
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post)
            return next(new ApiError("Post wasn't found,try again!", 404))
        if (req.user.role !== "admin") {
            if (post.author.toString() !== req.user._id.toString()) {
                return next(new ApiError("You don't have permission to update this post", 403))
            }
        }
        if (await Post.findOne({
            title,
            _id: { $ne: id }
        }))
            return res.status(404).json({ message: "Title has to be unique" })
        post.title = title || post.title
        post.content = content || post.content
        post.images = images || post.images
        await post.save()
        res.status(201).json({ message: "Post updated successfully", post })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

export const deleteAllPosts = async (req, res, next) => {
    try {
        const post = await Post.deleteMany({ author: req.user._id })
        if (!post)
            return next(new ApiError("Post isn't found", 404))

        res.status(200).json({ message: "All posts deleted successfully!" })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post)
            return next(new ApiError("Post isn't found", 404))
        if (req.user.role !== "admin") {
            if (post.author.toString() !== req.user._id.toString()) {
                return next(new ApiError("You don't have permission to delete this post", 403))
            }
        }
        await Post.findByIdAndDelete(id)
        res.status(200).json({ message: "Post deleted successfully!" })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

export const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post)
            return res.status(404).json({ message: "Post doesn't exist,try again!" })
        res.status(200).json({ message: "Found successfully", post: post })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

export const getAllPostsForOneAuthor = async (req, res, next) => {
    try {
        const { id } = req.params
        const posts = await Post.find({ author: id })
        if (posts.length === 0) {
            return res.status(404).json({ message: "Author wasn't found!,or the author has no posts" })
        }
        res.status(200).json({ message: "Author found", posts })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,please try again", 500))
    }
}

