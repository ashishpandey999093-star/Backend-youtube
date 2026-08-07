import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asynchandler.js"
import { Subscription } from "../models/subscription.model.js"
import mongoose from "mongoose"





const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    if (subscription) {
        //user is subscribed
        const deletedSubscription = await Subscription.findByIdAndDelete(subscription._id);
        return res.status(200).json(
            new ApiResponse(
                200,
                deletedSubscription,
                "Channel unsubscribed successfully"
            )
        )
    } else {
        //user is not subscribed 
        const newSubscription = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                newSubscription,
                "Channel subscribed successfully"
            )
        )
    }

})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1,

                        }
                    }
                ]

            }

        },
        {
            $addFields: {
                subscriber: {
                    $first: "$subscribers"
                }
            }
        },
        {
            $project: {
                subscribers: 0,
                _id: 0,
                channel: 0
            }
        }
    ])


    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "subscribers fetched"
        )
    )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannels",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }

        },
        {
            $addFields: {
                subscribedChannels: {
                    $first: "$subscribedChannels"
                }
            }
        }
        ,
        {
            $project: {
                channel: 0,
                subscriber: 0,
                _id: 0
            }
        }
    ])
    // console.log(subscribedChannels);
    console.log(Array.isArray(subscribedChannels));


    return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Channels fetched  successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}