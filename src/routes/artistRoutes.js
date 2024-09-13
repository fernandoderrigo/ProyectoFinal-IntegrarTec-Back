import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import artistController from "../controllers/artistController.js";
import { createArtistSchema } from "../schemas/artistSchema.js";

const router = Router();
const { createArtist, getAllArtists } = artistController();

router.route('/')
    .get(getAllArtists)
    .post(schemaValidator(createArtistSchema), createArtist)

export default router