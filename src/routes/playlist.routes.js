import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    removeVideoFromPlaylist,
    addVideoToPlaylist,
    getPlaylistById,
    getUserPlaylists
} from "../controllers/playlist.controller.js";

const router = Router()

router.use(verifyJWT)
router.route("/").post(createPlaylist);
router.route("/p/:playlistId").delete(deletePlaylist);
router.route("/p/:playlistId").patch(updatePlaylist);
router.route("/p/:playlistId/v/:videoId").delete(removeVideoFromPlaylist);
router.route("/p/:playlistId/v/:videoId").post(addVideoToPlaylist);
router.route("/p/:playlistId").get(getPlaylistById);
router.route("/u/:userId").get(getUserPlaylists);






export default router