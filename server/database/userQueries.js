import dbPromise from './db.js';
import bcrypt from 'bcrypt';

// Create a new user (signup)
async function createUser(email, password, first_name, last_name) {
  const db = await dbPromise;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.run(
    `INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)`,
    [email, hashedPassword, first_name, last_name]
  );

  return { id: result.lastID, email, first_name, last_name };
}

// Find user by email
async function getUserByEmail(email) {
  const db = await dbPromise;

  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  return user;
}

// Get user by ID
async function getUserById(userId) {
  const db = await dbPromise;

  const user = await db.get(
    `SELECT id, email, first_name, last_name FROM users WHERE id = ?`,
    [userId]
  );

  return user;
}

async function deleteUser(userId) {
  const db = await dbPromise;
  await db.run(`DELETE FROM users WHERE id = ?`, [userId]);
}

export { createUser, getUserByEmail, getUserById, deleteUser };
