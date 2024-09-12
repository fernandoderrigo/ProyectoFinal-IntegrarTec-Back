import { Router } from "express";
import verifyMiddleware from "../middlewares/verifyMiddleware";
import { schemaValidator } from "../middlewares/schemaValidator";
import songController from "../controllers/songController";
import { createSongSchema, idSongSchema, nameSongSchema, updateSongSchema } from "../schemas/songSchema";

const router = Router();
const { createSong, getSongs, getSongByName, getSongById, updateSong, deleteSong } = songController();

router.route('/')
    .get(getSongs)
    .post(schemaValidator(createSongSchema), createSong)

router.route('/:id')
    .get(schemaValidator(idSongSchema), getSongById)
    .put(verifyMiddleware, schemaValidator(updateSongSchema), updateSong)
    .delete(verifyMiddleware, schemaValidator(idSongSchema), deleteSong)

router.route('/:name')
    .get(schemaValidator(nameSongSchema),getSongByName);

export default router