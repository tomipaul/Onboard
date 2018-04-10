import express from 'express';
import {
  changePassword,
  modifyProfile,
  resetPassword,
  saveSession,
  getSessions,
  updateSession,
} from '../controllers/UserController';

const userRouter = express.Router();

userRouter.put('/api/v1/user', modifyProfile());
userRouter.put('/api/v1/user/password', changePassword());
userRouter.patch('/api/v1/user/password/reset', resetPassword());

userRouter.get('/api/v1/user/session', getSessions());
userRouter.post('/api/v1/user/session', saveSession());
userRouter.put('/api/v1/user/session/:sessionId', updateSession());

export default userRouter;
