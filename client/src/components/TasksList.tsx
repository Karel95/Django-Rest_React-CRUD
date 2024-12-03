import { useEffect, useState } from "react";
import { getAllTasks } from "../api/tasks.api";

interface Task {
  id: number;
  title: string;
  description: string;
}

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    async function loadTasks() {
      const res = await getAllTasks()
      setTasks(res)
      console.log(res)
    }
    loadTasks()
  }, []);

  return <div>
    {tasks.map(task => (
      <div key={task.id}>
        {task.title} - {task.description}
      </div>
    ))}
    </div>;
}
