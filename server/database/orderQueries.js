// server/database/orderQueries.js
import dbPromise from './db.js';
import { clearCart } from './cartQueries.js';

// Create an order from the cart
async function createOrder(userId) {
  const db = await dbPromise;

  // Get all cart items for the user
  const cartItems = await db.all(
    `SELECT cart_items.quantity, products.price
     FROM cart_items
     JOIN products ON cart_items.product_id = products.id
     WHERE cart_items.user_id = ?`,
    [userId]
  );

  if (cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Insert into orders table
  const result = await db.run(
    `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`,
    [userId, totalPrice]
  );

  const orderId = result.lastID;

  // Normally we would have an order_items table to save products separately.
  // To keep it simple, we skip that for now.

  // Clear the user's cart
  await clearCart(userId);

  return { orderId, totalPrice };
}

// Get all orders for a user
async function getOrders(userId) {
  const db = await dbPromise;
  const orders = await db.all(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return orders;
}

export { createOrder, getOrders };
