import dbPromise from './db.js';

// Add a product to wishlist
async function addToWishlist(userId, productId, size, custom_name = null, custom_number = null) {
  const db = await dbPromise;
  const existing = await db.get(
    `SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );

  if (!existing) {
    await db.run(
      `INSERT INTO wishlist_items (user_id, product_id, size, custom_name, custom_number)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, productId, size, custom_name, custom_number]
    );
  }
}


// Get all wishlist items for a user
async function getWishlist(userId) {
  const db = await dbPromise;

  const wishlist = await db.all(
    `SELECT 
       wishlist_items.id as wishlistItemId,
       wishlist_items.size,
       wishlist_items.custom_name,
       wishlist_items.custom_number,
       products.*
     FROM wishlist_items
     JOIN products ON wishlist_items.product_id = products.id
     WHERE wishlist_items.user_id = ?`,
    [userId]
  );

  return wishlist;
}

// Remove a product from wishlist
async function removeFromWishlist(wishlistItemId) {
  const db = await dbPromise;
  await db.run(
    `DELETE FROM wishlist_items WHERE id = ?`,
    [wishlistItemId]
  );
}

export { addToWishlist, getWishlist, removeFromWishlist };
