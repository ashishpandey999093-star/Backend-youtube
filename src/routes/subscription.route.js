import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription,getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";
const router=Router();
router.use(verifyJWT)
router.route("/c/:channelId").post(toggleSubscription).get(getUserChannelSubscribers);
router.route("/u/:subscriberId").get(getSubscribedChannels)

export default router
//xyz
//6a6b1972c9e870e8eff7072b
//ashish
//6a65d97750bac380e527ad58