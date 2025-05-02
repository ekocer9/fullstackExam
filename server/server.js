import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Required to use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

// Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bearer'],
  },
});
app.set('io', io);

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://127.0.0.1:8080',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import routers
import authRouter from './routers/auth/authRouter.js';
app.use(authRouter);

import productRouter from './routers/products/productRouter.js';
app.use(productRouter);

import cartRouter from './routers/cart/cartRouter.js';
app.use(cartRouter);

import orderRouter from './routers/orders/orderRouter.js';
app.use(orderRouter);

import wishlistRouter from './routers/wishlist/wishlistRouter.js';
app.use(wishlistRouter);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
