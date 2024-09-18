import { Router } from "express";
import artistController from "../controllers/artistController.js";

const router = Router();
const { createArtist, getAllArtists } = artistController();

router.route('/')
    .get(getAllArtists)
    .post(createArtist)

export default router