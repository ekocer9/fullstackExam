// server/routers/orders/orderRouter.js
import { Router } from 'express';
import { createOrder, getOrders } from '../../database/orderQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';

const router = Router();

// POST /api/orders/checkout
router.post('/api/orders/checkout', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const order = await createOrder(userId);
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});


// GET all orders for a user
router.get('/api/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await getOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
