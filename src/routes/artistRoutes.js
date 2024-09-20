import { Router } from "express";
import artistController from "../controllers/artistController.js";
import verifyMiddleware from "../middlewares/verifyMiddleware.js"

const router = Router();
const { createArtist, getAllArtists, getArtistById, deleteArtist, updateArtist } = artistController();

router.route('/')
    .get(getAllArtists)
    .post(verifyMiddleware,createArtist)

router.route('/:id')
    .get(getArtistById)
    .put(verifyMiddleware,updateArtist)
    .delete(verifyMiddleware,deleteArtist)

export default router