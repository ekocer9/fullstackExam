// server/routers/cart/cartRouter.js
import { Router } from 'express';
import { addToCart, getCartItems, removeFromCart } from '../../database/cartQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';

const router = Router();

// GET all cart items for logged-in user
router.get('/api/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const cartItems = await getCartItems(userId);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST add a product to cart
router.post('/api/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, size } = req.body;

  if (!productId || !quantity || !size) {
    return res.status(400).json({ message: 'Missing productId, quantity, or size' });
  }  

  try {
    await addToCart(userId, productId, quantity, size);
    res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE a product from cart
router.delete('/api/cart/:cartItemId', authenticateToken, async (req, res) => {
  const { cartItemId } = req.params;

  try {
    await removeFromCart(cartItemId);
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;