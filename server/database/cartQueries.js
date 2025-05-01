import dbPromise from './db.js';

// Add a product to the cart
async function addToCart(userId, productId, quantity) {
  const db = await dbPromise;

  // Check if the product is already in the cart
  const existing = await db.get(
    'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (existing) {
    // If exists, update quantity
    const newQuantity = existing.quantity + quantity;
    await db.run(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQuantity, existing.id]
    );
  } else {
    // If not exists, insert new cart item
    await db.run(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
  }
}

// Get all items in the cart for a user
async function getCartItems(userId) {
  const db = await dbPromise;
  const cartItems = await db.all(
    `SELECT cart_items.id as cartItemId, products.*, cart_items.quantity
     FROM cart_items
     JOIN products ON cart_items.product_id = products.id
     WHERE cart_items.user_id = ?`,
    [userId]
  );
  return cartItems;
}

// Remove a product from the cart
async function removeFromCart(cartItemId) {
  const db = await dbPromise;
  await db.run('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
}

// Clear cart after checkout
async function clearCart(userId) {
  const db = await dbPromise;
  await db.run('DELETE FROM cart_items WHERE user_id = ?', [userId]);
}

export { addToCart, getCartItems, removeFromCart, clearCart };
