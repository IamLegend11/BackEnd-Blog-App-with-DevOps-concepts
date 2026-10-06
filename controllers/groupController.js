import { Group } from "../models/groupDb.js"
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/db.js"

export const getAllGroups = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit
        return res.status(200).json({ Groups: await Group.find().skip(skip).limit(limit).sort({ createdAt: -1 }) });
    } catch (err) {
        console.error(err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

export const createGroup = async (req, res, next) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({
                message: 'Name is required.'
            });
        }
        if (await Group.findOne({ name }))
            return res.status(400).json({ message: 'Group name has to be unique' });
        const group = await Group.create({ name, admins: [req.user._id] })
        res.status(201).json({ message: "Group created successfully!", group })
    } catch (err) {
        console.error("Error:", err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

export const addUserToGroup = async (req, res, next) => {
    try {
        const { groupId, userId, permission } = req.body
        const group = await Group.findById(groupId)
        if (!group)
            return next(new ApiError("Group wasn't found, try again!", 404))

        const user = await User.findById(userId)
        if (!user)
            return next(new ApiError("User wasn't found, try again!", 404))

        if (!group.admins.includes(req.user._id.toString()))
            return next(new ApiError("You are not an admin of this group!", 401))

        if (group.members.includes(userId))
            return next(new ApiError("User is already a member of this group!", 400))

        group.members.push(userId)
        group.permissions.push(permission || "read")
        await group.save()
        return res.status(201).json({ message: "Added user successfully", group: group })
    }
    catch (err) {
        console.error(err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

export const removeUserFromGroup = async (req, res, next) => {
    try {
        const { userId, groupId } = req.body
        const group = await Group.findById(groupId)
        if (!group)
            return next(new ApiError("Group wasn't found, try again!", 404))
        if (!group.admins.includes(req.user._id.toString()))
            return next(new ApiError("You are not an admin of this group!", 401))
        if (!group.members.includes(userId.toString()))
            return next(new ApiError("Member wasn't found, try again!", 404))
        group.members = group.members.filter(x => x != userId.toString())
        await group.save()
        return res.status(200).json({ message: "Removed user successfully", group: group })
    } catch (err) {
        console.error(err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

export const updateGroupPermission = async (req,res,next) => {
    try {
        const { permission,groupId,userId } = req.body
        const group = await Group.findById(groupId)
        if (!group)
            return next(new ApiError("Group wasn't found, try again!", 404))
        if (!group.admins.includes(req.user._id.toString()))
            return next(new ApiError("You are not an admin of this group!", 401))
        if (!group.members.includes(userId.toString()))
            return next(new ApiError("Member wasn't found, try again!", 404))
        const index = group.members.indexOf(userId.toString())
        group.permissions[index] = permission
        await group.save()
        return res.status(200).json({ message: "Updated User permission successfully", group: group })
    } catch (err) {
        console.error(err)
        return next(new ApiError("Internal Server Error,try again", 500))
    }
}

// let ar = ["Meo1o","aw1","1"]
// ar = ar.filter(x => x == "aw1")
// console.log(ar)