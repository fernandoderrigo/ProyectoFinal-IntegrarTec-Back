import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import albumController from "../controllers/albumController.js";
import { createAlbumSchema } from "../schemas/albumSchema.js";

const router = Router();
const { createAlbum, getAllAlbums} = albumController();

router.route('/')
    .get(getAllAlbums)
    .post(createAlbum)

export default router