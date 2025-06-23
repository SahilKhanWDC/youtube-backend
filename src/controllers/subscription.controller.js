import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const { subscriberId } = req.user._id
    if(!isValidObjectId(channelId)){
        return new ApiError(400, "Invalid Channel ID")
    }
    if(subscriberId.toString() === channelId.toString()){
        return new ApiError(400, "You cannot subscribe to yourself")
    }
    const existingSubscription = await Subscription.findOne({subscriber : subscriberId, channel : channelId})
    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).json(new ApiResponse(200,{},"Unsubscribed successfully!"))
    }
    await Subscription.create({subscriber : subscriberId, channel : channelId})
    return res.status(201).json(new ApiResponse(201,{},"Subscribed successfully!"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id!")
    }
    const subscriberDocs = await Subscription.find({channel : channelId}).populate("subscriber", "_id name email")
    if(!subscriberDocs){
        throw new ApiError(404, "No subscribers found!")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, subscriberDocs, "Subscribers fetched successfully!"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id!")
    }
    const subscribedChannels = await Subscription.find({subscriber : subscriberId}).populate("channel", "_id name email")
    if(!subscribedChannels){
        throw new ApiError(404, "No channels subscribed!")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "subscribed Channels fetched successfully!"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}