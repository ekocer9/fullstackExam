// server/routers/products/productRouter.js
import { Router } from 'express';
import { getAllProducts, getProductById } from '../../database/productQueries.js';
import { authenticateToken } from '../../middleware/middleware.js'; // Only needed if any endpoint is protected

const router = Router();

// GET all products
router.get('/api/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET single product by ID (with reviews)
router.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
