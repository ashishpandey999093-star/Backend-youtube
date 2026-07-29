import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js";


const createTweet = asyncHandler( async(req,res) => {
         const body = req.body || {} ;
       
         const {content}=body;

         if(!content){
            throw new ApiError(400,"cannot upload empty tweet")
         }
         const user=await User.findById(req.user?._id);

          if(!user){
            throw new ApiError(400,"user not found")
         }

         const tweet= await Tweet.create({
            owner:user._id,
            content
         })
         
         if(!tweet){
            throw new ApiError(400,"user not found")
         }
         
         return res.status(200)
         .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet successfuly posted"
            )
         )

})

const getUserTweet = asyncHandler(async (req,res) => {
    
    const user=await User.findById(req.user?._id);
    if(!user){
        throw new ApiError(400,"user not found")
    }
    const owner =user._id ;
    

    //find accepts an object with conditions
    const tweets= await Tweet.find({
        owner
    });
    
    if(!tweets){
          throw new ApiError(400,"No tweets")
    }
    console.log(tweets);
    return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    tweets,
                    "Tweets fetched successfully"
                )
            )

})

const editTweet = asyncHandler(async (req, res) => {
     const {tweetId,newTweet}= req.body || {};
     if(!tweetId){
        throw new ApiError(400,"Invalid tweetId")
     }
     if(!newTweet){
        throw new ApiError(400,"Same as previous")
     }

     const tweet= await Tweet.findById(tweetId);

     if(!tweet){
        throw new ApiError(400,"Tweet not found")
     }

     tweet.content=newTweet;
     const updatedTweet= await tweet.save({ validateBeforeSave: false })

     return res.status(200).json(
        new ApiResponse(200,
            updatedTweet,
            "edited successfully"
        )
     )
})   

const deleteTweet = asyncHandler(async (req, res) => {
     const {tweetId}= req.body || {};
     if(!tweetId){
        throw new ApiError(400,"Invalid tweetId")
     }

    const deletedTweet= await Tweet.findByIdAndDelete(tweetId);
    
    if(!deletedTweet){
        throw new ApiError(400,"Tweet doesn't exists")
    }
    return res.status(200).json(
        new ApiResponse(200,
            deletedTweet,
            "deleted successfully"
        )
     )
})

export {createTweet,getUserTweet,editTweet,deleteTweet}