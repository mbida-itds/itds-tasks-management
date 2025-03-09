import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { authOptions } from './auth/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }
  await connectDB();
  const { name } = await req.json();
  const publicLink = `${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
  const project = new Project({ name, createdBy: session.user.id, publicLink });
  await project.save();
  return new Response(JSON.stringify(project), { status: 201 });
}
