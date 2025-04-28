// server/routers/reviews/reviewRouter.js
import { Router } from 'express';
import { addReview, getReviewsByProductId } from '../../database/reviewQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';

const router = Router();

// POST a new review for a product
router.post('/api/reviews', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    return res.status(400).json({ message: 'Product ID, rating, and comment are required' });
  }

  try {
    await addReview(userId, productId, rating, comment);
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET all reviews for a specific product
router.get('/api/reviews/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await getReviewsByProductId(productId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
