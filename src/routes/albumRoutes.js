import { Router } from "express";
import albumController from "../controllers/albumController.js";

const router = Router();
const { createAlbum, getAllAlbums, updateAlbum, deleteAlbum, getAlbumById} = albumController();

router.route('/')
    .get(getAllAlbums)
    .post(createAlbum)

router.route('/:id')
    .get(getAlbumById)
    .delete(deleteAlbum)
    .put(updateAlbum)

export default router