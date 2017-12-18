import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import authRouter from './routes/authRoutes';
import errorHandler from './controllers/errorHandler';

const app = express();

// mount all middleware and handlers
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(authRouter);
app.get('*', (req, res) => {
  res.status(200).send('Welcome to the onboard API');
});
app.use(errorHandler());

const server = http.createServer(app);
export default server;

