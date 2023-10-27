import React from "react";
import { AiFillEdit } from "react-icons/ai";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useRef } from "react";
import { Todo, TodoShema, validationFormTodoSchema } from "@/model/todos";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  todo: Todo;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Todo[], Error>>;
};

const UpdateTodoDialog = ({ todo, refetch }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  type ValidationFormTodoSchema = z.infer<typeof validationFormTodoSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationFormTodoSchema>({
    resolver: zodResolver(validationFormTodoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
    },
  });

  const mutationFunc = async (data: Todo) => {
    const response = await fetch("/api/updateTodo", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return TodoShema.parse(result);
  };

  const mutation = useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      refetch();
    },
  });

  const onSubmit: SubmitHandler<ValidationFormTodoSchema> = async (data) => {
    mutation.mutateAsync({ ...data, id: todo.id, completed: todo.completed });
    dialogRef.current?.close();
  };

  if (mutation.error instanceof Error) {
    console.log(mutation.error.message);
  }

  return (
    <div className="flex items-center">
      <dialog ref={dialogRef} className="rounded-md bg-white p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <p className="text-sm">Todo title</p>
          <input
            className="rounded-md border border-black p-2"
            {...register("title")}
            placeholder="Title"
          />
          {errors.title && (
            <p className="text-xs italic text-red-500">
              {errors.title?.message}
            </p>
          )}
          <p className="text-sm">Todo description</p>
          <input
            className="rounded-md border border-black p-2 pb-20"
            {...register("description")}
            placeholder="Description"
          />
          <div className="mt-3 flex gap-3">
            <button
              className="rounded-md bg-teal-500 p-2 text-white"
              type="submit"
            >
              Update todo
            </button>
            <button
              className="rounded-md bg-teal-500 p-2 text-white"
              type="reset"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>

      <button className="px-4 " onClick={() => dialogRef.current?.showModal()}>
        <AiFillEdit size={25} />
      </button>
    </div>
  );
};

export default UpdateTodoDialog;
