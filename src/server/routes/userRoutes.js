import express from 'express';
import { saveSession } from '../controllers/UserController';

const userRouter = express.Router();
userRouter.post('/api/v1/user/session', saveSession());

export default userRouter;
