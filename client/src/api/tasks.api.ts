import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface NewTask {
  title: string;
  description: string;
}

const tasksApi = axios.create({
  baseURL: 'http://localhost:8000/tasks/api/v1/tasks/',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // to send cookies with requests
//  'maxRedirects': 0, // to avoid infinite redirects
})

export function getAllTasks() {
  return (
    // axios.get('http://localhost:8000/tasks/api/v1/tasks/')
    //  .then(response => response.data)
    //  .catch(error => console.log(error))
    tasksApi.get<Task[]>('/')
     .then(response => response.data)
     .catch(error => console.log(error))
  )
}

export function createTask (task: NewTask) {
  return (
    // axios.post('http://localhost:8000/tasks/api/v1/tasks/', task)
    //  .then(response => response.data)
    //  .catch(error => console.log(error))
    tasksApi.post('/', task)
     .then(response => response.data)
     .catch(error => console.log(error))
  )
}

export function deleteTask (id: number) {
  // tasksApi.delete(`/${id}/`)
  tasksApi.delete('/' + id + '/')
}

export function updateTask (id: number, task: NewTask) {
  // tasksApi.put(`/${id}/`, task)
  tasksApi.put('/' + id + '/', task)
   .then(response => response.data)
   .catch(error => console.log(error))
}

export function getTaskById (id: number) {
  return (
    tasksApi.get(`/${id}/`)
    .then(response => response.data)
    .catch(error => console.log(error))
  )
}
