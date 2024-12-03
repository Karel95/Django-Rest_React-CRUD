import { useEffect, useState } from "react";
import { getAllTasks } from "../api/tasks.api";
import { TaskCard } from "./TaskCard";

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
      <TaskCard key={task.id} task={task} />
    ))}
    </div>;
}
