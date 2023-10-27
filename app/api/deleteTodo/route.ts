import { Todo } from '@/model/todos';
import { promises as fs } from 'fs';

export const DELETE = async (req: Request) => {
	const file = await fs.readFile(`${process.cwd()}/app/data.json`, 'utf8');
	const data = JSON.parse(file) as Todo[];

	const requiredTodo = (await req.json()) as Todo;
	const updatedTodos = data.filter(todo => todo.id !== requiredTodo.id)
	

	await fs.writeFile(
		`${process.cwd()}/app/data.json`,
		JSON.stringify(updatedTodos)
	);

	return Response.json(requiredTodo)
}