import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from
 "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema({
        videoFile:{
            type:String,//closinary url
            required:[true,"Video required"]
        },
        thumbnail:{
            type:String,//closinary url
            required:[true,"thumbnail required"]
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number, //cloudinary url
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

}, { timestamps: true });

videoSchema.plugin(mongooseAggregatePaginate);



export const Video = mongoose.model('Video', videoSchema);