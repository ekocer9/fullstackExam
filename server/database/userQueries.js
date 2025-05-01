import dbPromise from './db.js';
import bcrypt from 'bcrypt';

// Create a new user (signup)
async function createUser(email, password) {
  const db = await dbPromise;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hashedPassword]
  );

  return { id: result.lastID, email };
}

// Find user by email (for login)
async function getUserByEmail(email) {
  const db = await dbPromise;

  const user = await db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );

  return user;
}

// Get user by ID (protected profile endpoint, optional)
async function getUserById(userId) {
  const db = await dbPromise;

  const user = await db.get(
    `SELECT id, email FROM users WHERE id = ?`,
    [userId]
  );

  return user;
}

async function deleteUser(userId) {
  const db = await dbPromise;

  await db.run(`DELETE FROM users WHERE id = ?`, [userId]);
}

export { createUser, getUserByEmail, getUserById, deleteUser };
