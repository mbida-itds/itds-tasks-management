import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { authOptions } from './auth/[...nextauth]';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'tester') {
    return new Response('Unauthorized', { status: 401 });
  }
  await connectDB();
  const { title, description, group, projectId, assignedTo } = await req.json();
  const task = new Task({
    title,
    description,
    group,
    project: projectId,
    assignedTo,
    createdBy: session.user.id,
  });
  await task.save();
  return new Response(JSON.stringify(task), { status: 201 });
}