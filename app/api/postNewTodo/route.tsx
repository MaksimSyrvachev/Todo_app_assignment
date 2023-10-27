import { Todo } from "@/model/todos";
import { promises as fs } from "fs";

export const POST = async (req: Request) => {
  const file = await fs.readFile(`${process.cwd()}/app/data.json`, "utf8");
  const data = JSON.parse(file) as Todo[];

  const newTodo = (await req.json()) as Todo;
  const newTodos = [...data, newTodo];

  await fs.writeFile(
    `${process.cwd()}/app/data.json`,
    JSON.stringify(newTodos)
  );

  return Response.json(newTodo);
};
