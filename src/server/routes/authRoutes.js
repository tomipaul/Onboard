import express from 'express';
import AuthController from '../controllers/AuthController';

const authRouter = express.Router();
authRouter.post(
  '/api/v1/user/signup',
  AuthController.createUser(),
);

authRouter.post(
  '/api/v1/user/signin',
  AuthController.loginUser()
);

authRouter.post(
  '/api/user/password/recover',
  AuthController.forgotPassword()
);

export default authRouter;
