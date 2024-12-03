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

export const TaskCard: React.FC<TaskCardProps> = ({task}) => {
  return (
    <div key={task.id}>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <hr />
    </div>
  )
}
