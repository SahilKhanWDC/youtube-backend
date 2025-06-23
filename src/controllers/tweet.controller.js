import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const ownerId = req.user._id
    if(!content){
        throw new ApiError(400, "Content is required")
    }
    const newTweet = await Tweet.create({
        content,
        owner : ownerId
    })
    if(!newTweet){
        throw new ApiError(400, "Failed to create tweet")
    }
    return res.status(201).json(new ApiResponse(201,newTweet,"tweet created successfully!"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 })
    if(!tweets || tweets.length===0){
        throw new ApiError(404, "No tweets found")
    }
    return res.status(200).json(new ApiResponse(200, tweets, "tweets retrieved successfully!"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const tweetId = req.params.id
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    const { content } = req.body
    const userId = req.user._id
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }
    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to update this tweet")
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{ content }
        },
        {
            new : true
        }
    )
    if(!updatedTweet){
        throw new ApiError(400, "Failed to update tweet")
    }
    return res.status(200).json(new ApiResponse(200,updateTweet,"tweet updated successfully!"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweetId = req.params.id
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    const userId = req.user._id
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }
    if(tweet.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    if(!deletedTweet){
        throw new ApiError(400, "Failed to delete tweet")
    }
    return res.status(200).json(new ApiResponse(200,deletedTweet,"tweet deleted successfully!"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}