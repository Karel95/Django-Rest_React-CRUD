import { useForm } from "react-hook-form";
// otras bibliotecas recomendadas para usar junto a 'react-hook-form':
// yup
// zod
import { createTask } from "../api/tasks.api";
import { useNavigate } from "react-router-dom";

interface NewTask {
  title: string;
  description: string;
}

export function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTask>();

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async data => {
    // // Enviar los datos al API para guardar la tarea
    await createTask(data)
    // // Redireccionar a la página de tareas
    // window.location.href = "/tasks";
    navigate("/tasks");
    // // Opcionalmente, mostrar un mensaje de éxito al guardar la tarea
    alert("Task created successfully!");
  });
  // // Validaciones personalizadas con 'react-hook-form'
  // const validationSchema = yup.object().shape({
  //   title: yup.string().required("Title is required"),
  //   description: yup.string().required("Description is required"),
  // });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: true })}
        />
        {errors.title && <span>Title is required!</span>}
        <textarea
          id=""
          rows={3}
          placeholder="Description"
          {...register("description", { required: true })}
        ></textarea>
        {errors.description && <span>Description is required!</span>}
        <button>Save</button>
      </form>
    </div>
  );
}
