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
  const { productId, quantity, size, custom_name, custom_number } = req.body;

  if (!productId || !quantity || !size) {
    return res.status(400).json({ message: 'Missing productId, quantity, or size' });
  }

  try {
    await addToCart(userId, productId, quantity, size, custom_name, custom_number);
    res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

import { updateCartItemQuantity } from '../../database/cartQueries.js';

router.patch('/api/cart/:cartItemId', authenticateToken, async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    await updateCartItemQuantity(cartItemId, quantity);
    res.status(200).json({ message: 'Quantity updated' });
  } catch (error) {
    console.error('Error updating quantity:', error);
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