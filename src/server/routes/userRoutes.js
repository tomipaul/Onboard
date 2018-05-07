import express from 'express';
import {
  changePassword,
  modifyProfile,
  resetPassword,
  saveSession,
  getSessions,
  updateSession,
  deleteSession,
} from '../controllers/UserController';

const userRouter = express.Router();

userRouter.put('/api/v1/user', modifyProfile());
userRouter.put('/api/v1/user/password', changePassword());
userRouter.patch('/api/v1/user/password/reset', resetPassword());

userRouter.get('/api/v1/user/session', getSessions());
userRouter.post('/api/v1/user/session', saveSession());
userRouter.put('/api/v1/user/session/:sessionId', updateSession());
userRouter.delete('/api/v1/user/session/:sessionId', deleteSession());

export default userRouter;
