"use client";

import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useContext, useRef } from "react";
import { Todo, TodoShema, validationFormTodoSchema } from "@/model/todos";
import { SubmitHandler, useForm } from "react-hook-form";
import { LastIdContext } from "./Providers";

type Props = {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Todo[], Error>>;
};

const AddTodoDialog = ({ refetch }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lastId, _setLastId] = useContext(LastIdContext);

  type ValidationFormTodoSchema = z.infer<typeof validationFormTodoSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationFormTodoSchema>({
    resolver: zodResolver(validationFormTodoSchema),
  });

  const mutationFunc = async (data: Todo) => {
    const response = await fetch("/api/postNewTodo", {
      method: "POST",
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
    mutation.mutateAsync({ ...data, id: lastId + 1, completed: false });
    dialogRef.current?.close();
    reset();
  };

  if (mutation.error instanceof Error) {
    console.log(mutation.error.message);
  }

  return (
    <div>
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
              Add todo
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

      <button
        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 border rounded ml-10 mt-5"
        onClick={() => dialogRef.current?.showModal()}
      >
        Add todo
      </button>
    </div>
  );
};

export default AddTodoDialog;
