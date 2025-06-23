import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user._id
    if (!isValidObjectId(videoId)) {
        return new ApiError(400, "Invalid video id")
    }
    const likedVideo = await Like.findOne({video : videoId, likedBy : userId })
    if(likedVideo){
        await Like.findByIdAndDelete(likedVideo._id)
        return res.status(200).json(new ApiResponse(200,likedVideo, "video unliked successfully!"))
    }
    const likeVideo = Video.create({
        video: videoId,
        likedBy: userId
    })
    return res.status(201).json(201,likeVideo,"Video liked successfully!")
})

const toggleCommentLike = asyncHandler(async (req, res) => {jjksuslie3;wkf[kw[spwfeo]]
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user._id
    if (!isValidObjectId(commentId)){
        return new ApiError(400, "Invalid comment id")
    }
    const likedComment = await Like.findOne({comment : commentId, likedBy : userId })
    if(likedComment){
        await Like.findByIdAndDelete(likedComment._id)
        return res.status(200).json(new ApiResponse(200,likedComment, "comment unliked successfully!"))
    }
    const likeComment = await Like.create({
        comment: commentId,
        likedBy: userId
    })
    return res.status(201).json(201,likeComment,"commeent liked successfully!")

})
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user._id
    if (!isValidObjectId(tweetId)){
        return new ApiError(400, "Invalid tweet id")
    }
    const likedTweet = await Like.findOne({tweet : tweetId, likedBy : userId })
    if(likedTweet){
        await Like.findByIdAndDelete(likedTweet._id)
    }
    const likeTweet = await Like.create({
        tweet: tweetId,
        likedBy: userId
    })
    return res.status(201).json(201,likeTweet,"tweet liked successfully!")
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    const likedVideos = await Video.find({likedBy: userId, video: { $exists: true }}).populate('video', "_id title url")
    return res.status(200).json(new ApiResponse(200,likedVideos,"Liked videos retrieved successfully!"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}