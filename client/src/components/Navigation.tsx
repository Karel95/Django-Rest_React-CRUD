import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/create-task">Create new task</Link>
    </nav>
  );
}
