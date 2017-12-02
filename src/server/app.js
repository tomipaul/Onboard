import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
winston.configure({
  transports: [
    new (winston.transports.File)({ filename: 'server.log' })
  ]
});

app.get('*', (req, res) => {
  res.status(200).send('Welcome to the onboard API');
});

app.listen(port, () => {
  winston.log('info', `Server started on ${port}`);
});

export default app;
