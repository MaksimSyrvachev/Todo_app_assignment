"use client";

import AddTodoDialog from "@/components/AddTodoDialog";
import { LastIdContext } from "@/components/Providers";
import UpdateTodoDialog from "@/components/UpdateTodoDialog";
import { Todo, TodoShema, validationGetTodosShema } from "@/model/todos";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillDelete } from "react-icons/ai";
import { FadeLoader } from "react-spinners";

type FilterType = "all" | "completed" | "uncompleted";
type SelectFormInput = {
  filter: FilterType;
};

export default function Home() {
  const [_lastId, setLastId] = useContext(LastIdContext);
  const [filter, setFilter] = useState<FilterType>("all");
  const { register, handleSubmit } = useForm<SelectFormInput>();

  const queryFunc = async () => {
    const response = await fetch(`/api/getTodos?filter=${filter}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return validationGetTodosShema.parse(data);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["list", "todos"],
    queryFn: queryFunc,
  });

  const mutationCheckbox = useMutation({
    mutationFn: async (data: Todo) => {
      const response = await fetch("/api/changeTodoCompleteStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return validationGetTodosShema.parse(result);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (data: Todo) => {
      const response = await fetch("/api/deleteTodo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return TodoShema.parse(result);
    },
    onSuccess: () => {
      refetch();
    },
  });

  if (data && data.length !== 0) {
    const lastTodo = data[data.length - 1];
    setLastId(lastTodo.id);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center mt-6">
        <FadeLoader color="#36d7b7" />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleCheck = async (data: Todo) => {
    mutationCheckbox.mutateAsync(data);
  };

  const handleDelete = async (data: Todo) => {
    mutationDelete.mutateAsync(data);
  };

  const onSubmit: SubmitHandler<SelectFormInput> = async (data) => {
    await setFilter(data.filter);
    refetch();
  };

  return (
    <main>
      <div className="flex justify-between">
        <AddTodoDialog refetch={refetch} />
        <div className="flex flex-row mt-7 mr-10">
          <span className="font-semibold text-lg">
            Number of uncompleted tasks:{" "}
            {data?.filter((todo) => todo.completed !== true).length}
          </span>
          <form onChange={handleSubmit(onSubmit)}>
            <select
              className="font-semibold ml-4 text-lg border-2 border-green-700 rounded"
              defaultValue="all"
              {...register("filter")}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="uncompleted">Uncompleted</option>
            </select>
          </form>
        </div>
      </div>
      <ul className="mx-10 my-4 shadow-md  w-auto border rounded-md">
        {data?.map((todo) => (
          <li key={todo.id} className=" border px-6 py-4 flex justify-between">
            <div className="flex flex-row">
              <input
                id="green-checkbox"
                type="checkbox"
                onChange={() => handleCheck(todo)}
                checked={todo.completed}
                className="w-6 h-6 mt-4 mr-5"
              />
              <div className="flex flex-col flex-wrap">
                <span className="font-semibold text-lg">{todo.title}</span>
                <p className="text-gray-700 break-words">{todo.description}</p>
              </div>
            </div>
            <div className="flex flex-row flex-wrap">
              <UpdateTodoDialog todo={todo} refetch={refetch} />
              <button className="px-4" onClick={() => handleDelete(todo)}>
                <AiFillDelete size={25} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
