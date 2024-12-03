import { useEffect } from "react";
import { getAllTasks } from "../api/tasks.api";

export function TasksList() {
  useEffect(() => {
    async function loadTasks() {
      const res = await getAllTasks()
      console.log(res)
    }
    loadTasks()
  }, []);

  return <div>TasksList</div>;
}
