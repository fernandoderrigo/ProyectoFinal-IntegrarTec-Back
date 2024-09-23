import { Router } from "express";
import playlistController from "../controllers/playlistController.js";

const router = Router();
const { createPlaylist, getPlaylists, getPlaylistByName, updatePlaylist, deletePlaylist } = playlistController();

router.route('/')
    .get(getPlaylists)
    .post(createPlaylist)

router.route('/:id')
    .put(updatePlaylist)
    .delete(deletePlaylist)

router.route('/name/:name')
    .get(getPlaylistByName);

export default router;