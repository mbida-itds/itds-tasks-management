import connectDB from '@/lib/db';
import Task from '@/models/Task';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || ''; // Use a secure secret in production

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let decoded;
    try {
      // Verify token
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token has expired. Please log in again.' });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const query = { assignedTo: decoded.id }; // Use the user ID from the token
      const tasks = await Task.find(query).populate('assignedTo', 'email');
      return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
      const { title, description, group, projectId, assignedTo } = req.body;
      
      if (!title || !projectId) {
        return res.status(400).json({ message: 'Title and projectId are required' });
      }
      
      const task = new Task({
        title,
        description,
        group,
        project: projectId,
        assignedTo,
        createdBy: decoded.id, // Use the user ID from the token
      });
      await task.save();
      return res.status(201).json(task);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API /tasks error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}