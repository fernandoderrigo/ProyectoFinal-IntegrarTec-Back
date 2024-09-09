import express from 'express';
import userHistoryController from '../controllers/userHistoryController.js';
import { createUserHistorySchema } from '../schemas/userHistorySchema.js'
import { schemaValidator } from '../middlewares/schemaValidator.js';

const router = express.Router();
const {createUserHistory, getUserHistory, getAllUsersHistories} = userHistoryController();

router.route('/')
    .get(getAllUsersHistories)
    .post(schemaValidator(createUserHistorySchema),createUserHistory);

router.get('/user/:userId', getUserHistory);

export default router;