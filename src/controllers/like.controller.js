import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asynchandler.js"
import { Like } from "../models/like.model.js"
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(404, "User id required")
    }

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
                    "Video unliked successfully"

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


//have to implement comment controller
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(404, "User id required")
    }
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid object id")
    }

    const likedComment = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    if (likedComment) {
        await Like.findByIdAndDelete(likedComment._id)

        return res.status(200).
            json(
                new ApiResponse(
                    200,
                    {},
                    "Comment unliked successfully"

                )
            )
    } else {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }


        const newCommentLike = await Like.create({
            comment: commentId,
            likedBy: userId
        })
        return res.status(200).
            json(
                new ApiResponse(
                    200,
                    newCommentLike,
                    "Comment liked successfully"

                )
            )
    }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(404, "User id required")
    }
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid object id")
    }

    const likedTweet = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    if (likedTweet) {
        await Like.findByIdAndDelete(likedTweet._id)

        return res.status(200).
            json(
                new ApiResponse(
                    200,
                    {},
                    "Tweet unliked successfully"

                )
            )
    } else {
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }


        const newTweetLike = await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        return res.status(200).
            json(
                new ApiResponse(
                    200,
                    newTweetLike,
                    "Tweet liked successfully"

                )
            )
    }


})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(404, "User id required")
    }

    let likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
                video: { $ne: null }
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            owner: 1,
                            title: 1,
                            duration: 1,
                            views: 1,
                        }
                    }
                ]

            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }

        },
        {
            $project: {
                _id:0,
                likedBy:0
            }
        }
    ])


    if (!likedVideos?.length) {
        likedVideos = {}
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            likedVideos,
            "Liked videos successfully fetched"
        )
    )
})




export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}