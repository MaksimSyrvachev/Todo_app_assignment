import { Todo } from '@/model/todos';
import { promises as fs } from 'fs';

export const PATCH = async (req: Request) => {
	const file = await fs.readFile(`${process.cwd()}/app/data.json`, 'utf8');
	const data = JSON.parse(file) as Todo[];

	const updatedTodo = (await req.json()) as Todo;
	const updatedTodos = data.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
	

	await fs.writeFile(
		`${process.cwd()}/app/data.json`,
		JSON.stringify(updatedTodos)
	);

	return Response.json(updatedTodo)
}