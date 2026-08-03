import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Comment } from "../models/comment.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";




const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {content} = req.body
    const userId = req.user?._id;

    if (!content?.trim()) {
        throw new ApiError(400, "Content can't be empty")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    //checking that no one add comment without video
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    })

    return res.status(201).
        json(
            new ApiResponse(
                201,
                comment,
                "Comment added successfully"
            )
        )

})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const {content}= req.body
    const userId = req.user?._id;

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if(!comment.owner.equals(userId)){
        throw new ApiError(403, "Unauthorised access")
    }

    comment.content=content


//   if aisa ho jaaye to validatw nhi hatana
//     content: {
//     type: String,
//     minlength: 5
// }
//   await comment.save() hi rakhna
    await comment.save({validateBeforeSave:false})

    return res.status(200).
        json(
            new ApiResponse(
                200,
                comment,
                "Comment updated successfully"
            )
        )

})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId } = req.params

    const userId = req.user?._id;


    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid object id")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment does'nt exists")
    }

    if(!comment.owner.equals(userId)){
        throw new ApiError(403, "Unauthorised access")
    }
    
    const deletedComment=comment
    await comment.deleteOne()


    return res.status(200).
        json(
            new ApiResponse(
                200,
                deletedComment,
                "Comment deleted successfully"
            )
        )

})


export {
    addComment,
    updateComment,
    deleteComment
}