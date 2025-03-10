import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Dashboard() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', group: '', projectId: '', assignedTo: '' });

  useEffect(() => {
    if (session) {
      fetch('/api/projects').then((res) => res.json()).then(setProjects);
      fetch('/api/tasks').then((res) => res.json()).then(setTasks);
    }
  }, [session]);

  const handleCreateTask = async () => {
    if (session?.user.role !== 'tester') return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    if (res.ok) {
      setTasks([...tasks, await res.json()]);
      setNewTask({ title: '', description: '', group: '', projectId: '', assignedTo: '' });
    }
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status } : t)));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {projects.map((project) => (
          <Card key={project._id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Public Link: <a href={`/project/${project.publicLink}`} className="text-blue-500">{project.publicLink}</a></p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Creation (Tester Only) */}
      {session?.user.role === 'tester' && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <Input
                placeholder="Group"
                value={newTask.group}
                onChange={(e) => setNewTask({ ...newTask, group: e.target.value })}
              />
              <Select onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Assigned To (User ID)"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              />
              <Button onClick={handleCreateTask}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Task List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {task.status}</p>
                <p>Group: {task.group || 'General'}</p>
                <p>Assigned To: {task.assignedTo?.email || 'Unassigned'}</p>
                {session?.user.role === 'developer' && task.status !== 'completed' && (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(task._id, 'done_pending')}
                  >
                    Mark as Done
                  </Button>
                )}
                {session?.user.role === 'tester' && task.status === 'done_pending' && (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(task._id, 'completed')}
                  >
                    Validate
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}