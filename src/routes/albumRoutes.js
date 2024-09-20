import { Router } from "express";
import albumController from "../controllers/albumController.js";
import verifyMiddleware from "../middlewares/verifyMiddleware.js"

const router = Router();
const { createAlbum, getAllAlbums, updateAlbum, deleteAlbum, getAlbumById} = albumController();

router.route('/')
    .get(getAllAlbums)
    .post(verifyMiddleware,createAlbum)

router.route('/:id')
    .get(getAlbumById)
    .delete(verifyMiddleware,deleteAlbum)
    .put(verifyMiddleware,updateAlbum)

export default router