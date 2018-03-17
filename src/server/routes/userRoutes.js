import express from 'express';
import { saveSession, resetPassword } from '../controllers/UserController';

const userRouter = express.Router();
userRouter.post('/api/v1/user/session', saveSession());

userRouter.patch('/api/v1/user/password/reset', resetPassword());

export default userRouter;
