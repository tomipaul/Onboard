import express from 'express';
import {
  modifyProfile,
  resetPassword,
  saveSession
} from '../controllers/UserController';

const userRouter = express.Router();

userRouter.put('/api/v1/user', modifyProfile());
userRouter.post('/api/v1/user/session', saveSession());
userRouter.patch('/api/v1/user/password/reset', resetPassword());

export default userRouter;
