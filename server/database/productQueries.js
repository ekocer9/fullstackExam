import dbPromise from './db.js';

// Get all products
async function getAllProducts() {
  const db = await dbPromise;
  const products = await db.all('SELECT * FROM products');
  return products;
}

// Get a single product by ID (with reviews)
async function getProductById(productId) {
  const db = await dbPromise;

  const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);

  if (!product) return null;

  const reviews = await db.all(
    `SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at, users.email
     FROM reviews
     JOIN users ON reviews.user_id = users.id
     WHERE reviews.product_id = ?`,
    [productId]
  );

  product.reviews = reviews;
  return product;
}

export { getAllProducts, getProductById };
