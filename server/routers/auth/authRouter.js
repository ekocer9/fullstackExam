import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserById, deleteUser } from '../../database/userQueries.js';
import { authenticateToken } from '../../middleware/middleware.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// POST /api/auth/signup
router.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await createUser(email, password);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/auth/login
router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/auth/profile
router.get('/api/auth/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PATCH /api/auth/profile
router.patch('/api/auth/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: 'Email or password required' });
  }

  try {
    const db = await dbPromise;
    if (email) {
      await db.run('UPDATE users SET email = ? WHERE id = ?', [email, userId]);
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await db.run('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// DELETE /api/auth/delete
router.delete('/api/auth/delete', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
