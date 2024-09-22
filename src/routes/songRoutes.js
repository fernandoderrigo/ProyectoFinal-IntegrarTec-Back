import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import songController from "../controllers/songController.js";
import {nameSongSchema} from "../schemas/songSchema.js";

const router = Router();
const { createSong, getSongs, getSongByName,getSongById, updateSong, deleteSong } = songController();

router.route('/')
    .get(getSongs)
    .post(createSong)

router.route('/:id')
    .put(updateSong)
    .get(getSongById)
    .delete(deleteSong)

router.route('/name/:name')
    .get(getSongByName);

export default router