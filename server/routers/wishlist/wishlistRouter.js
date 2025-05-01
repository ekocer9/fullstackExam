// server/routers/wishlist/wishlistRouter.js
import { Router } from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../../database/wishlistQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';

const router = Router();

// GET all wishlist items for a user
router.get('/api/wishlist', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await getWishlist(userId);
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST add a product to wishlist
router.post('/api/wishlist', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, size } = req.body;

  if (!productId || !size) {
    return res.status(400).json({ message: 'Product ID and size are required' });
  }

  try {
    await addToWishlist(userId, productId, size);
    res.status(201).json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE a product from wishlist
router.delete('/api/wishlist/:wishlistItemId', authenticateToken, async (req, res) => {
  const { wishlistItemId } = req.params;

  try {
    await removeFromWishlist(wishlistItemId);
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
