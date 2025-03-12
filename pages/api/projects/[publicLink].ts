import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret in production

export async function GET(req, { params }) {
  await connectDB();
  
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Verify token
  const decoded = jwt.verify(token, JWT_SECRET);
  const project = await Project.findOne({ publicLink: params.publicLink });
  
  if (!project) return new Response('Project not found', { status: 404 });
  
  const tasks = await Task.find({ project: project._id }).populate('assignedTo', 'email');
  return new Response(JSON.stringify({ project, tasks }), { status: 200 });
}