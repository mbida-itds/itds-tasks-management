import connectDB  from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || ''; // Use a secure secret in production

// Function to generate a random key of 6 characters (letters and digits)
const generateRandomKey = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export default async function handler(req, res) {
  try {
    await connectDB();
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (req.method === 'POST') {
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
      }

      const publickey = generateRandomKey(); // Generate a random key
      const project = new Project({ name, createdBy: decoded.id, publickey });
      await project.save();
      return res.status(201).json(project);
    } else if (req.method === 'GET') {
      const { publickey } = req.query; // Get public key from query parameters
    
      if (!publickey) {
        return res.status(400).json({ message: 'Public key is required' });
      }
    
      const project = await Project.findOne({ publickey }).populate('groups').populate({
        path: 'tasks',
        model: Task,
      });
    
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
    
      return res.status(200).json(project);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API /projects error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}