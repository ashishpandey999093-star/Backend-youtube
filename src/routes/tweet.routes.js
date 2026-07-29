import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweet,editTweet,deleteTweet } from "../controllers/tweet.controller.js";

const router=Router();

router.use(verifyJWT)

router.route("/").post(createTweet);
router.route("/get-tweets").post(getUserTweet)
router.route("/edit-tweet").post(editTweet)
router.route("/delete-tweet").post(deleteTweet)


export default router