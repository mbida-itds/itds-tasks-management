import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; // Import Recharts components

interface Project {
  _id: string;
  name: string;
  tasks: Task[];
}

interface Task {
  _id: string;
  title: string;
  updatedAt: Date;
  userDetails?: { name: string }; // Optional user details
}

interface Stats {
  totalProjects: number;
  tasksByStatus: { _id: string; count: number }[];
  dailyStatusChanges: { _id: string; count: number }[];
  completedTasks: Task[];
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, tasksByStatus: [], dailyStatusChanges: [], completedTasks: [] });
  const [userRole, setUserRole] = useState<string>(''); // Assume you have a way to get the user's role
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    };

   // fetchProjects();
  }, []);

  const handleProjectSelect = async (projectId: string) => {
    setSelectedProject(projectId);
    const res = await fetch(`/api/projects/${projectId}`);
    const data = await res.json();
    setTasks(data.tasks); // Assuming the response includes tasks
  };

  const fetchDashboardStats = async () => {
    const res = await fetch(`/api/dashboard?date=${selectedDate}`);
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    if (selectedProject) {
      fetchDashboardStats();
    }
  }, [selectedProject, selectedDate]);

  return (
    <div className="p-4">
      {userRole === 'admin' && (
        <Button onClick={() => router.push('/create-project')}>Create Project</Button>
      )}
      <Select onChange={handleProjectSelect}>
        {projects?.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </Select>
      <input 
        type="date" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
        className="border rounded p-2 my-4"
      />
      <div className="mb-4">
        <h2 className="text-xl font-bold">Total Projects: {stats.totalProjects}</h2>
        <h2 className="text-xl font-bold">Tasks by Status:</h2>
        <ul className="list-disc pl-5">
          {stats.tasksByStatus && stats.tasksByStatus.map(status => (
            <li key={status._id}>{status._id}: {status.count}</li>
          ))}
        </ul>
        <h2 className="text-xl font-bold">Daily Status Changes:</h2>
        <LineChart
          width={600}
          height={300}
          data={stats.dailyStatusChanges}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
      {tasks.length > 0 && (
        <div>
          {tasks.map((task) => (
            <Card key={task._id}>
              <h3>{task.title}</h3>
              {userRole === 'tester' ? (
                <Button>Edit Task</Button> // Full edit for testers
              ) : (
                <Button>Change Status</Button> // Limited edit for developers
              )}
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Completed Tasks for {selectedDate}:</h2>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">User</th>
              <th className="border border-gray-300 p-2">Task Title</th>
              <th className="border border-gray-300 p-2">Completion Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.completedTasks && stats.completedTasks.map(task => (
              <tr key={task._id}>
                <td className="border border-gray-300 p-2">{task.userDetails?.name}</td>
                <td className="border border-gray-300 p-2">{task.title}</td>
                <td className="border border-gray-300 p-2">{new Date(task.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}