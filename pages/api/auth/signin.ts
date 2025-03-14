import { NextApiRequest, NextApiResponse } from 'next';
import  connectDB  from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || ''; // Use a secure secret in production

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectDB();
    const { email, password } = req.body;

    // Sign In
    const user = await User.findOne({ email, active: true });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ token,fullName: user.fullName,role: user.role });
      }

    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}