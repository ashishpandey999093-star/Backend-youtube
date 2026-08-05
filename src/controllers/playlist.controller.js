import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(400, "name & description both required")
    }
    const userId = req.user._id;

    const playlist = await Playlist.create({
        name,
        description,
        createdBy: userId
    })


    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist created successfully"
        )
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const userId = req.user._id;

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!playlist.createdBy.equals(userId)) {
        throw new ApiError(403, "Unauthorised access")
    }
    const response = await playlist.deleteOne()

    return res.status(200).
        json(
            new ApiResponse(
                200,
                response,
                "Playlist deleted successfully"
            )
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body;
    const userId = req.user._id;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!playlist.createdBy.equals(userId)) {
        throw new ApiError(403, "Unauthorised access")
    }

    playlist.name = name;
    playlist.description = description;

    const response = await playlist.save()

    return res.status(200).
        json(
            new ApiResponse(
                200,
                response,
                "Playlist updated successfully"
            )
        )

})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const userId = req.user._id;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!playlist.createdBy.equals(userId)) {
        throw new ApiError(403, "Unauthorised access")
    }


    playlist.videos.push(videoId);

    const updatedPlaylist = await playlist.save();

    return res.status(200).
        json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Video added successfully"
            )
        )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const userId = req.user._id;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!playlist.createdBy.equals(userId)) {
        throw new ApiError(403, "Unauthorised access")
    }

    // const updatedPlaylist= await Playlist.findByIdAndUpdate(
    //     playlistId,
    //     {
    //         $pull:{
    //             videos:videoId
    //         }
    //     }
    // )

    playlist.videos = playlist.videos.filter(
        id => !id.equals(videoId)
    );

    const updatedPlaylist = await playlist.save();

    return res.status(200).
        json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Video removed successfully"
            )
        )


})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const userId = req.user._id;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)
        .select("-isPrivate")
        .populate({
            path: "createdBy",
            select: "fullName username avatar"
        })
        .populate({
            path: "videos",
            select: "videoFile thumbnail title description duration views owner",
            populate: {
                path: "owner",
                select: "fullName username avatar"
            }
        });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.isPrivate && !playlist.createdBy.equals(userId)) {
        throw new ApiError(403, "Unauthorised access to a private playlist")
    }

    return res.status(200).
        json(
            new ApiResponse(
                200,
                playlist,
                "Playlist fetched successfully"
            )
        )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [{
                    $project: {
                        videoFile: 1,
                        thumbnail: 1,
                        title: 1,
                        duration: 1,
                        views: 1,
                        owner: 1
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [
                            {
                                $project: {
                                    fullName: 1,
                                    avatar: 1,
                                }
                            }
                        ]
                    },
                },
                {
                    $addFields: {
                        owner: {
                            $first: "$owner"
                        }
                    }
                }
                ]
            }
        },
        {
            $project: {
                isPrivate: 0
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            playlists,
            "User playlists fetched successfully"
        )
    )
})


export {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    removeVideoFromPlaylist,
    addVideoToPlaylist,
    getPlaylistById,
    getUserPlaylists

}