import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweet } from "../controllers/tweet.controller.js";

const router=Router();

router.use(verifyJWT)

router.route("/").post(createTweet);
router.route("/get-tweets").post(getUserTweet)

export default router