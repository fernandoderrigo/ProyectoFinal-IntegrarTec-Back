import { Router } from "express";
import playlistController from "../controllers/playlistController";

const router = Router();
const {createPlaylist, getPlaylists, getPlaylistsByName, updatePlaylist, deletePlaylist} = playlistController();

router.route('/')
    .get(getPlaylists)
    .post(createPlaylist)

router.route('/:id')
    .put(updatePlaylist)
    .delete(deletePlaylist)

router.route('/:name')
    .get(getPlaylistsByName)