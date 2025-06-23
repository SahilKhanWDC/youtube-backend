import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!isValidObjectId(videoId)){
        return new ApiError(400, "Invalid video id")
    }
    const videoObjectId = new mongoose.Types.ObjectId(videoId)
    const comments = await Comment.aggregate([
        {
            $match: {video : videoObjectId}
        },
        {
            $lookup : {
                from: 'videos',
                localField: 'video',
                foreignField: '_id',
                as: 'commentOnWhichVideo'
            }
        },
        {
            $lookup:{
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'commentOwner'
            }
        },
        {
            $project:{
                content : 1,
                owner : { $arrayElemAt: ['$commentOwner._id', 0] },
                video : { $arrayElemAt: ['$commentOnWhichVideo._id', 0] },
                createdAt : 1
            }
        },
        {
            $skip : (page-1)*parseInt(limit)
        },
        {
            $limit : parseInt(limit)
        }
    ])
    if(!comments?.length){
        return new ApiError(404, "No comments found")
    }
    return res.status(200).json(new ApiResponse(200,comments,"comments fetched successfully!"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body
    if(!isValidObjectId(videoId)){
        return new ApiError(400, "Invalid video id")
    }
    if(!content){
        return new ApiError(400, "Content is required")
    }
    if(!req.user){
        return new ApiError(401, "You must be logged in to add a comment")
    }
    const addedComment = await Comment.create({
        content,
        owner: req.user?._id,
        video: videoId
    })
    if(!addComment){
        return new ApiError(500, "Failed to add comment")
    }
    return res.status(200).json(new ApiResponse(200,addedComment,"comment added successfully!"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    if(!isValidObjectId(commentId)){
        return new ApiError(400, "Invalid comment id")
    }
    if(!content){
        return new ApiError(400, "Content is required")
    }
    if(!req.user){
        return new ApiError(401, "You must be logged in to update a comment")
    }
    const updatedComment = await Comment.findByIdAndUpdate(
        {
            _id: commentId,
            owner: req.user?._id
        },
        {
            $set:{ content }
        },
        { new :  true }
    )
    if(!updatedComment){
        return new ApiError(500, "Failed to update comment")
    }
    return res.status(200).json(new ApiResponse(200,updateComment,"comment updated successfully!"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    if(!isValidObjectId(commentId)){
        return new ApiError(400, "Invalid comment id")
    }
    if(!req.user){
        return new ApiError(401, "You must be logged in to delete a comment")
    }
    const deletedComment = await Comment.findByIdAndDelete(
        {
            _id: commentId,
            owner: req.user?._id
        }
    )
    if(!deletedComment){
        return new ApiError(500, "Failed to delete comment")
    }
    return res.status(200).json(new ApiResponse(200,deletedComment,"comment deleted successfully!"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }