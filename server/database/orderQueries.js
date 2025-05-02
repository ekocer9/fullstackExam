import dbPromise from './db.js';
import { clearCart } from './cartQueries.js';

// Create an order from the cart
async function createOrder(userId) {
  const db = await dbPromise;

  // Get all cart items for the user
  const cartItems = await db.all(
    `SELECT * FROM cart_items WHERE user_id = ?`,
    [userId]
  );

  if (!cartItems.length) {
    throw new Error("Cart is empty");
  }

  // Calculate total price by joining with products
  const detailedItems = await db.all(
    `SELECT cart_items.*, products.price, products.name
     FROM cart_items
     JOIN products ON cart_items.product_id = products.id
     WHERE cart_items.user_id = ?`,
    [userId]
  );

  const totalPrice = detailedItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Insert the order
  const result = await db.run(
    `INSERT INTO orders (user_id, total_price, created_at)
     VALUES (?, ?, datetime('now'))`,
    [userId, totalPrice]
  );

  const orderId = result.lastID;

  // Insert each item into order_items table
  for (const item of detailedItems) {
    await db.run(
      `INSERT INTO order_items (order_id, product_id, quantity, size, custom_name, custom_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, item.product_id, item.quantity, item.size, item.custom_name, item.custom_number]
    );
  }

  // Clear the cart
  await db.run(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);

  return {
    id: orderId,
    total_price: totalPrice,
    created_at: new Date().toISOString(),
    items: detailedItems
  };
}

// Get all orders for a user
async function getOrders(userId) {
  const db = await dbPromise;

  const orders = await db.all(
    `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );

  for (const order of orders) {
    order.items = await db.all(
      `SELECT order_items.quantity, order_items.size, order_items.custom_name, order_items.custom_number,
              products.name, products.price, products.image
       FROM order_items
       JOIN products ON order_items.product_id = products.id
       WHERE order_items.order_id = ?`,
      [order.id]
    );
  }

  return orders;
}

export { createOrder, getOrders };
