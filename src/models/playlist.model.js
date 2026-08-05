import mongoose, { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const playlistSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type:String,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    videos: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Video"
        }
    ],
    isPrivate:{
        type:String,
        default:false
    }
})

//why are we not using aggregatepaginate here
// playlistSchema.plugin(mongooseAggregatePaginate)

export const Playlist= mongoose.model("Playlist" , playlistSchema);