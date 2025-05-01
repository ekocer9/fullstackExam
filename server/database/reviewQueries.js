import dbPromise from './db.js';

// Create a new review for a product
async function addReview(userId, productId, rating, comment) {
  const db = await dbPromise;

  await db.run(
    `INSERT INTO reviews (user_id, product_id, rating, comment)
     VALUES (?, ?, ?, ?)`,
    [userId, productId, rating, comment]
  );
}

// Get all reviews for a product
async function getReviewsByProductId(productId) {
  const db = await dbPromise;

  const reviews = await db.all(
    `SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at, users.email
     FROM reviews
     JOIN users ON reviews.user_id = users.id
     WHERE reviews.product_id = ?
     ORDER BY created_at DESC`,
    [productId]
  );

  return reviews;
}

export { addReview, getReviewsByProductId };
