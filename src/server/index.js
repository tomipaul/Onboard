import dotenv from 'dotenv';
import winston from 'winston';
import server from './server';

dotenv.config();
const port = process.env.PORT || 5000;
winston.configure({
  transports: [
    new (winston.transports.File)({ filename: 'server.log' })
  ]
});

server.listen(port, () => {
  winston.log('info', `Server started on ${port}`);
});

export default server;
