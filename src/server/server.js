import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes';
import errorHandler from './controllers/errorHandler';
import AuthController from './controllers/AuthController';

const app = express();

// mount all middleware and handlers
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the onboard API');
});
app.use(authRouter);
app.use(
  AuthController.getClientToken(),
  AuthController.authorizeUser()
);
app.use(errorHandler());

const server = http.createServer(app);
export default server;

