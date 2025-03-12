import connectDB from '@/lib/db';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret in production

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (req.method === 'GET') {
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      const projects = await Project.find({ createdBy: decoded.id }); // Use the user ID from the token
      return res.status(200).json(projects);
    }

    if (req.method === 'POST') {
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
      }
      
      const publicLink = `${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
      const project = new Project({ name, createdBy: decoded.id, publicLink });
      await project.save();
      return res.status(201).json(project);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API /projects error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}