import {Router} from "express"
import { publishVideo,getVideoById, updateVideoDetails } from "../controllers/video.controller.js"
import  {verifyJWT}  from "../middlewares/auth.middleware.js";
import  {upload}  from "../middlewares/multer.middleware.js"
const router = Router();




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

router.route("/get-video/:videoId").get(getVideoById)


router.route("/update-video-details/:videoId").post(verifyJWT,
    upload.single([
      "thumbnail"
    ])
    ,updateVideoDetails)
export default router