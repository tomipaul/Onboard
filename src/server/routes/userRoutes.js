import express from 'express';
import {
  changePassword,
  modifyProfile,
  resetPassword,
  saveSession,
  getSessions,
} from '../controllers/UserController';

const userRouter = express.Router();

userRouter.get('/api/v1/user/session', getSessions());
userRouter.put('/api/v1/user', modifyProfile());
userRouter.post('/api/v1/user/session', saveSession());
userRouter.put('/api/v1/user/password', changePassword());
userRouter.patch('/api/v1/user/password/reset', resetPassword());

export default userRouter;
