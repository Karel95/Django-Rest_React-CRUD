import { useEffect } from "react";
import { useForm } from "react-hook-form";
// otras bibliotecas recomendadas para usar junto a 'react-hook-form':
// yup
// zod
import {
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
} from "../api/tasks.api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface NewTask {
  title: string;
  description: string;
}

export function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NewTask>();

  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      const taskId = Number(params.id);
      if (!isNaN(taskId)) {
        await updateTask(taskId, data);
        toast.success('Task updated successfully', {
          icon: "success",
          duration: 3000,
          position: "top-right",
          style: {
            background: "#32CD32",
            color: "white",
            borderRadius: "5px",
            padding: "10px",
            fontSize: "16px",
            fontWeight: "bold",
          }
        })
      } else {
        console.error("El ID no es válido.");
      }
    } else {
      // // Enviar los datos al API para guardar la tarea
      await createTask(data);
      // // Opcionalmente, mostrar un mensaje de éxito al guardar la tarea
      // alert("Task created successfully!");
      toast.success('Task created successfully', {
        icon: "success",
        duration: 3000,
        position: "top-right",
        style: {
          background: "#32CD32",
          color: "white",
          borderRadius: "5px",
          padding: "10px",
          fontSize: "16px",
          fontWeight: "bold",
        }
      })
    }
    // // Redireccionar a la página de tareas
    // window.location.href = "/tasks";
    navigate("/tasks");
  });
  // // Validaciones personalizadas con 'react-hook-form'
  // const validationSchema = yup.object().shape({
  //   title: yup.string().required("Title is required"),
  //   description: yup.string().required("Description is required"),
  // });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const taskId = Number(params.id);
        console.log(taskId);
        if (!isNaN(taskId)) {
          const task = await getTaskById(taskId);
          console.log(task);
          if (task) {
            // Rellenar el formulario con los datos de la tarea
            setValue("title", task.title);
            setValue("description", task.description);
          } else {
            console.error("La tarea no existe.");
          }
        } else {
          console.error("El ID no es válido.");
        }
      }

      // return () => {
      //   // Limpiar los valores del formulario cuando se desmonta la página
      //   reset();
      // };
    }
    loadTask();
  }, [params.id, setValue]);

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
        {params.id && typeof params.id === "string" && (
          <button
            onClick={async () => {
              const accepted = window.confirm("Are you sure?");
              if (accepted) {
                const taskId = Number(params.id);
                if (!isNaN(taskId)) {
                  await deleteTask(taskId);
                  toast.success('Task deleted successfully', {
                    icon: "success",
                    duration: 3000,
                    position: "top-right",
                    style: {
                      background: "#32CD32",
                      color: "white",
                      borderRadius: "5px",
                      padding: "10px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }
                  });
                  navigate("/tasks");
                } else {
                  console.error("El ID no es válido.");
                }
              }
            }}
          >
            Delete
          </button>
        )}
      </form>
    </div>
  );
}
