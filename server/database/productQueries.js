import dbPromise from './db.js';

// Get all products
async function getAllProducts() {
  const db = await dbPromise;
  const products = await db.all('SELECT * FROM products');
  return products;
}

// Get a single product by ID 
async function getProductById(productId) {
  const db = await dbPromise;

  const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);

  if (!product) return null;

  return product;
}

export { getAllProducts, getProductById };
