import express from 'express';
import AuthController from '../controllers/AuthController';

const authRouter = express.Router();
authRouter.post('/api/v1/user/signup', [
  AuthController.createUser(),
  AuthController.authenticateUser()
]);

export default authRouter;
