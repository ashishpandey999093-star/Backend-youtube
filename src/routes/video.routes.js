import {Router} from "express"
import { publishVideo,getVideoById, updateVideoDetails, deleteVideo,togglePublishStatus } from "../controllers/video.controller.js"
import  {verifyJWT}  from "../middlewares/auth.middleware.js";
import  {upload}  from "../middlewares/multer.middleware.js"
const router = Router();




router.route("/getVideo/:videoId").get(getVideoById)

//secured routes
router.route("/").post(verifyJWT,
    upload.fields([
         {
            name:"videoFile",
            maxCount:1
         },
         {
            name:"thumbnail",
            maxCount:1
         }

    ]),
    publishVideo
)
router.route("/updateVideoDetails/:videoId").post(verifyJWT,
    upload.single([
      "thumbnail"
    ])
    ,updateVideoDetails)
router.route("/deleteVideo/:videoId").post(verifyJWT,deleteVideo)
router.route("/changeisPublish/:videoId").post(verifyJWT,togglePublishStatus)

export default router