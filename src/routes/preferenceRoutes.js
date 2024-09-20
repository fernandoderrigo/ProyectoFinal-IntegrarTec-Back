import express from 'express';
import preferenceController from '../controllers/preferenceController.js';

const router = express.Router();
const {getPreferenceByIdUser} = preferenceController();

router.route('/:id')
    .get(getPreferenceByIdUser)

export default router;