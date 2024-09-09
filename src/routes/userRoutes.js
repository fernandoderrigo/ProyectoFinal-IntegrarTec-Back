import { Router } from 'express';
import verifyMiddleware from '../middlewares/verifyMiddleware.js';
import { schemaValidator } from '../middlewares/schemaValidator.js';
import { createUserSchema, idUserSchema, updateUserSchema } from '../schemas/userSchemas.js';
import userController  from '../controllers/userController.js';

const router = Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser, refreshToken} = userController();

router.route('/')
  .get(getUsers)
  .post(schemaValidator(createUserSchema), createUser)

router.route('/:id')
  .get(schemaValidator(idUserSchema), getUserById)
  .put(verifyMiddleware, schemaValidator(updateUserSchema), updateUser)
  .delete(verifyMiddleware,schemaValidator(idUserSchema), deleteUser)

router.route('/login')
  .post(loginUser);

router.route('/refresh-token')
  .post(refreshToken);
  
export default router;