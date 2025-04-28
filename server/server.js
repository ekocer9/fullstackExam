// server/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Bearer"],
  },
});

app.set('io', io);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization", "Bearer"],
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

import reviewRouter from './routers/reviews/reviewRouter.js';
app.use(reviewRouter);

import wishlistRouter from './routers/wishlist/wishlistRouter.js';
app.use(wishlistRouter);

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = 8080;
server.listen(PORT, () => {console.log(`Server running on PORT: ` + PORT);});
