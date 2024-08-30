import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import app from './src/app.js';
import errorHandler from './src/middlewares/errorHandler.js';

dotenv.config(); 

const SERVER_PORT = process.env.SERVER_PORT || 3001;
const server = express();

server.use(cors({
  origin: '*',
  methods: 'GET, POST, PUT, DELETE',
}));

server.use(express.json());
server.use('/api', app);
server.use(errorHandler);

server.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});