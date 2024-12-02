import { useEffect } from "react";

export function TasksList() {
  useEffect(() => {
    console.log("TasksList component rendered");
  }, []);

  return <div>TasksList</div>;
}
