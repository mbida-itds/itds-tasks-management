import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    await connectDB();
    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions);
      const projects = await Project.find(session ? { createdBy: session.user.id } : {});
      console.log('Projects fetched:', projects); // Debug log
      return res.status(200).json(projects);
    }
    if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
      }
      const publicLink = `${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
      const project = new Project({ name, createdBy: session.user.id, publicLink });
      await project.save();
      return res.status(201).json(project);
    }
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API /projects error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}