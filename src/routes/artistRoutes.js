import { Router } from "express";
import artistController from "../controllers/artistController.js";

const router = Router();
const { createArtist, getAllArtists, getArtistById, deleteArtist, updateArtist } = artistController();

router.route('/')
    .get(getAllArtists)
    .post(createArtist)

router.route('/:id')
    .get(getArtistById)
    .put(updateArtist)
    .delete(deleteArtist)

export default router