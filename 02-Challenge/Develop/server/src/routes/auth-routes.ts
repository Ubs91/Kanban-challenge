import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' } // Token expires in 2 hours
    );

    // Return the token
    res.json({ token, user: { username: user.username, id: user.id } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
