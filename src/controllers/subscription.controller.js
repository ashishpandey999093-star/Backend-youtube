import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asynchandler.js"
import { Subscription } from "../models/subscription.model.js"
import mongoose from "mongoose"





const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user?._id;

    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
    
     const subscription= await Subscription.findOne({
        subscriber:userId,
        channel:channelId
     })
     
     if(subscription){
        //user is subscribed
          const deletedSubscription= await Subscription.findByIdAndDelete(subscription._id);
          return res.status(200).json(
            new ApiResponse(
                200,
                deletedSubscription,
                "Channel unsubscribed successfully"
            )
          )
     } else {
        //user is not subscribed 
        const newSubscription= await Subscription.create({
            subscriber:userId,
            channel:channelId
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                newSubscription,
                "Channel subscriber successfully"
            )
        )
     }
     
})


export {toggleSubscription}