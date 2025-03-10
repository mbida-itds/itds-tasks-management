import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    await connectDB();
    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions);
      console.log('Session for /api/tasks:', session); // Debug session
      const query = session ? { assignedTo: session.user.id } : {};
      const tasks = await Task.find(query).populate('assignedTo', 'email');
      console.log('Tasks fetched:', tasks); // Debug tasks
      return res.status(200).json(tasks);
    }
    if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);
      if (!session || session.user.role !== 'tester') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
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
        createdBy: session.user.id,
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