import { Router } from "express";
import verifyMiddleware from '../middlewares/verifyMiddleware.js';
import { schemaValidator } from "../middlewares/schemaValidator.js";
import songController from "../controllers/songController.js";
import { createSongSchema, idSongSchema, nameSongSchema, updateSongSchema } from "../schemas/songSchema.js";

const router = Router();
const { createSong, getSongs, getSongByName,getSongById, updateSong, deleteSong } = songController();

router.route('/')
    .get(getSongs)
    .post(createSong)

router.route('/:id')
    .put(schemaValidator(updateSongSchema), updateSong)
    .get(getSongById)
    .delete(schemaValidator(idSongSchema), deleteSong)

router.route('/:name')
    .get(schemaValidator(nameSongSchema),getSongByName);

export default router