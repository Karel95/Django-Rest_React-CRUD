import { useNavigate } from "react-router-dom";

// Define el tipo de Task
interface Task {
  id: number;
  title: string;
  description: string;
}

// Especifica el tipo de las props de TaskCard
interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ background: "#101010" }}
      key={task.id}
      onClick={() => {
        // navigate(`/tasks/${task.id}`);
        navigate("/tasks/" + task.id);
      }}
    >
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <hr />
    </div>
  );
};
