import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublicProject({ publicLink }) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`/api/projects/${publicLink}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.project);
        setTasks(data.tasks);
      });
  }, [publicLink]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { publicLink: params.publicLink },
  };
}