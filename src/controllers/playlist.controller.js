import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name || !description){
        return new ApiError(400, "Name and description are required")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })
    if(!playlist){
        return new ApiError(400, "Failed to create playlist")
    }
    return res.status(201).json(new ApiResponse(201,playlist,"playlist created successfully!"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        return new ApiError(400, "Invalid user id")
    }
    const playlists = await Playlist.find({owner: userId})
    if(!playlists){
        return new ApiError(404, "No playlists found")
    }
    return res.status(200).json(new ApiResponse(200,playlists,"playlists retrieved successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        return new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId).populate("videos")
    if(!playlist){
        return new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,playlist,"playlist retrieved successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        return new ApiError(400, "Invalid playlist or video id")
    }
    const upadtedPlaylist = await Playlist.aggregate([
        {
            $match: { _id : new mongoose.Types.ObjectId(playlistId)}
        },
        {
            $addFields:{
                videos : {
                    $setUnion: ["$videos", [new mongoose.Types.ObjectId(videoId)]]
                }
            }
        },
        {
            $merge : {into : "playlists"}
        }
    ])
    if(!upadtedPlaylist){
        return new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,updatePlaylist,"video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        return new ApiError(400, "Invalid playlist or video id")
    }
    const updatedPlaylist = await Playlist.aggregate([
        playlistId,
        {
            $pull : {
                videos : new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            new : true
        }
    ])
    if(!updatedPlaylist){
        return new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,updatedPlaylist,"video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        return new ApiError(400, "Invalid playlist id")
    }
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    if(!deletedPlaylist){
        return new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,deletedPlaylist,"playlist deleted successfully!"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        return new ApiError(400, "Invalid playlist id")
    }
    if(!name || !description){
        return new ApiError(400, "Name and description are required")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {name, description}, {new : true})
    if(!updatedPlaylist){
        return new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200,updatedPlaylist,"playlist updated successfully!"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}