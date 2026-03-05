import {Request, Response} from 'express';
import User from '../models/user';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const user = new User({ email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({error: "User registration failed!"});
  }
};

// Login a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
