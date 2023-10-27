import * as z from "zod";

export type Todo = z.infer<typeof TodoShema>;

export const TodoShema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
});

export const validationGetTodosShema = z.array(TodoShema);

export const validationFormTodoSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title must contain at least one character" })
    .max(50, { message: "Title must be 50 or fewer characters long" }),
  description: z.string(),
});
