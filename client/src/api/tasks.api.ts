import axios from 'axios';


export function getAllTasks() {
  return (
    axios.get('http://localhost:8000/tasks/api/v1/tasks')
     .then(response => response.data)
     .catch(error => console.log(error))
  )
}

