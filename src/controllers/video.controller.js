import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // //TODO: get all videos based on query, sort, 
    if(!req.user){
        throw new ApiError(402, "User must be logged In!")
    }
    const match ={
        ...(query ? { title: { $regex: query, $options: 'i' }} : {}),
        ...(userId ? { owner : mongoose.Types.ObjectId(userId) } : {})
    }

    const videos = await Video.aggregate([
        {
            $match : match
        },
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "videosByOwner"
            }
        },
        {
            $project:{
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                owner: {
                    $arrayElemAt: ["$videosByOwner",0]
                }
            }
        },
        {
            $sort:{ [sortBy]: sortType === "desc" ? -1 : 1 }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    ])
    if(!videos?.length){
        throw new ApiError(400, "no videos found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,videos, "Videos fetched successfully!"))
    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, owner } = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title){
        throw new ApiError(400, "title is required")
    }
    if(!description){
        throw new ApiError(400, "description is required")
    }
    const videoFileLocalPath = req.files?.videoFile[0]
    if(!videoFileLocalPath){
        throw new ApiError(400, "video file is required")
    }
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail is required")
    }
    try {
        const duration = await getVideoDuration(videoFileLocalPath)
        const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        if(!videoFile){
            throw new ApiError(400, "video file upload failed")
        }
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(400, "thumbnail upload failed")
        }
        const videoCreated = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            title,
            description,
            duration,
            owner: req.user?._id
        })
        if(!videoCreated){
            throw new ApiError(500, "video creation failed")
        }
        return res
        .status(201)
        .json(201, videoCreated, "video created successfully!")
    } catch (error) {
        throw new ApiError(500, "failed to publish video")
    }
    // TODO: upload video to cloudinary
    const videoFile = await uploadVideoToCloudinary(videoFileLocalPath)
    const video = await createVideo(title, description, owner, videoFile)
    return res
    .status(200)
    .json(200, video, "video published successfully!")
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId).populate("owner","name email")
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,video, "Video fetched successfully!"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    let updateData = { title , description }
    if(req.file){
        const thumbnailLocalPath = req.file.path
        if(!thumbnailLocalPath){
            throw new ApiError(400, "Thumbnail not found")
        }
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(500, "Thumbnail upload failed")
        }
        updateData.thumbnail = thumbnail.url
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId, 
        { $set: updateData },
        { new: true , runValidators: true }
    )
    if(!updatedVideo){
        throw new ApiError(404, "Video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,updatedVideo, "Video updated successfully!"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if(!deletedVideo){
        throw new ApiError(404, "Video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,deletedVideo, "Video deleted successfully!"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return req
    .status(200)
    .json(new ApiResponse(200,video, "Video publish status updated successfully!"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}