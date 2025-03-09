import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Task from '@/models/Task';

export async function GET(req, { params }) {
  await connectDB();
  const project = await Project.findOne({ publicLink: params.publicLink });
  if (!project) return new Response('Project not found', { status: 404 });
  const tasks = await Task.find({ project: project._id }).populate('assignedTo', 'email');
  return new Response(JSON.stringify({ project, tasks }), { status: 200 });
}
