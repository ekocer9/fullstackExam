import dbPromise from './db.js';

// Add a product to the cart
async function addToCart(userId, productId, quantity, size, custom_name = null, custom_number = null) {
  const db = await dbPromise;

  // Check if the product is already in the cart (match by size + customization)
  const existing = await db.get(
    `SELECT * FROM cart_items 
     WHERE user_id = ? AND product_id = ? AND size = ? AND 
           (custom_name IS ? OR custom_name = ?) AND 
           (custom_number IS ? OR custom_number = ?)`,
    [userId, productId, size, custom_name, custom_name, custom_number, custom_number]
  );

  if (existing) {
    // ❗ SET quantity directly, instead of adding
    await db.run(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, existing.id]
    );
  } else {
    await db.run(
      `INSERT INTO cart_items (user_id, product_id, quantity, size, custom_name, custom_number)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, productId, quantity, size, custom_name, custom_number]
    ); 
  }
}

// Get all items in the cart for a user
async function getCartItems(userId) {
  const db = await dbPromise;
  const cartItems = await db.all(
    `SELECT cart_items.id as cartItemId, cart_items.size, cart_items.quantity,
    cart_items.custom_name, cart_items.custom_number,
    products.*
    FROM cart_items
    JOIN products ON cart_items.product_id = products.id
    WHERE cart_items.user_id = ?`,
    [userId]
  );  
  return cartItems;
}

async function updateCartItemQuantity(cartItemId, newQuantity) {
  const db = await dbPromise;
  await db.run(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [newQuantity, cartItemId]);
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

export { addToCart, getCartItems, removeFromCart, updateCartItemQuantity, clearCart };
