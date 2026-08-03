import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asynchandler.js"
import { Like } from "../models/like.model.js"
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid object id")
    }

    const videoLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    if (videoLike) {
        await Like.findByIdAndDelete(videoLike._id)

        return res.status(200).
            json(
                new ApiResponse(
                    200,
                    {},
                    "Video disliked successfully"

                )
            )
    } else {

        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }


        const newVideoLike = await Like.create({
            video: videoId,
            likedBy: userId
        })
        return res.status(200).
            json(
                new ApiResponse(
                    200,
                    newVideoLike,
                    "Video liked successfully"

                )
            )

    }

})


export { toggleVideoLike }