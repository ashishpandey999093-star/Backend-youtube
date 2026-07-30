import asyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

const publishVideo = asyncHandler(async (req,res) => {
    const owner=req.user?._id;
    const {title,description}=req.body ;
    const isPublished=0;
    const views=0;

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    
    if(!videoLocalPath){
        throw new ApiError(400,"Video is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail is required")
    }
    
    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    
    const publishedVideo = await Video.create({
        videoFile:video.url,
        thumbnail:thumbnail.url,
        owner,
        title,
        description,
        duration:video.duration,
        views,
        isPublished
    })
    
    if(!publishedVideo){
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


export {publishVideo}