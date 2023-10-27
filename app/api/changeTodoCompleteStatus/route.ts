import { Todo } from '@/model/todos';
import { promises as fs } from 'fs';


export const PUT = async (req: Request) => {
	const file = await fs.readFile(`${process.cwd()}/app/data.json`, 'utf8');
	const data = JSON.parse(file) as Todo[];

	const currentTodo = (await req.json()) as Todo;
	const updatedTodos = data.map(todo => todo.id === currentTodo.id ? {...todo, completed: !todo.completed} : todo)

	await fs.writeFile(
		`${process.cwd()}/app/data.json`,
		JSON.stringify(updatedTodos)
	);

	return Response.json(updatedTodos)
}