import mongoose from "mongoose"
import asyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js"

const publishVideo = asyncHandler(async (req, res) => {
    const owner = req.user?._id;
    const { title, description } = req.body;
    const isPublished = 0;
    const views = 0;

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail is required")
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video) {
        throw new ApiError(500, "Failed to upload video");
    }
    if (!thumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const publishedVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner,
        title,
        description,
        duration: video.duration,
        views,
        isPublished
    })

    if (!publishedVideo) {
        throw new ApiError(500, "Failed to save video details to the database");
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                publishedVideo,
                "Video uploaded successfully"
            )
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video fetched successfully"
        )
    )
})

const updateVideoDetails = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    const { videoId } = req.params
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(404, "invalid videoId")
    }
    const { newTitle, newDescription } = req.body || {}


    const newThumbnailLocalPath = req.file?.path;

    const video = await Video.findByIdAndUpdate(videoId)

 
    if (!video.owner.equals(userId)) {
        throw new ApiError(403, "Unauthorised access")
    }

    let isUpdate = 0;
    if (newTitle) {
        video.title = newTitle
        isUpdate = 1
    }
    if (newDescription) {
        video.description = newDescription
        isUpdate = 1
    }
    if (newThumbnailLocalPath) {
        const newThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);
        video.thumbnail = newThumbnail.url
        isUpdate = 1
    }

    if (!isUpdate) {
        throw new ApiError(400, "No changes provided for update")
    }

    const updatedVideo = await video.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Successfully updated"
            )
        )
})

export { publishVideo, getVideoById, updateVideoDetails }