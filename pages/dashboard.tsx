import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Select, Card } from '@/components/ui'; // Assuming you have these components

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userRole, setUserRole] = useState(''); // Assume you have a way to get the user's role
  const router = useRouter();

  useEffect(() => {
    // Fetch projects and user role
    const fetchProjects = async () => {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = async (projectId) => {
    setSelectedProject(projectId);
    const res = await fetch(`/api/projects/${projectId}`);
    const data = await res.json();
    setTasks(data.tasks); // Assuming the response includes tasks
  };

  return (
    <div>
      {userRole === 'admin' && (
        <Button onClick={() => router.push('/create-project')}>Create Project</Button>
      )}
      <Select onChange={handleProjectSelect}>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </Select>
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
    </div>
  );
}