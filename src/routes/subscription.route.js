import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const router=Router();

router.route("/c/:channelId").post(verifyJWT,toggleSubscription);


export default router
//xyz
//6a6b1972c9e870e8eff7072b
//ashish
//6a65d97750bac380e527ad58