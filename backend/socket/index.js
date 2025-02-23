import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import multer from 'multer';
import {connectDB} from '../db/ConnectDB.js';

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
export const io = new Server(server, {
  cors: {
    origin: '*', // Allow frontend to connect
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Multer setup for file uploads using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('joinRoom', (tvId) => {
    socket.join(tvId);
    console.log(`Client joined room: ${tvId}`);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Export app and server
export { app, server };

