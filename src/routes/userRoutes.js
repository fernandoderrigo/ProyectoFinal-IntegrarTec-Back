import { Router } from 'express';
import verifyMiddleware from '../middlewares/verifyMiddleware.js';
import { schemaValidator } from '../middlewares/schemaValidator.js';
import {idUserSchema } from '../schemas/userSchemas.js';
import userController  from '../controllers/userController.js';

const router = Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser, refreshToken} = userController();

router.route('/')
  .get(verifyMiddleware,getUsers)
  .post(createUser)

router.route('/:id')
  .get(schemaValidator(idUserSchema), getUserById)
  .put(verifyMiddleware,updateUser)
  .delete(verifyMiddleware,schemaValidator(idUserSchema), deleteUser)

router.route('/login')
  .post(loginUser);

router.route('/refresh-token')
  .post(refreshToken);
  
export default router;