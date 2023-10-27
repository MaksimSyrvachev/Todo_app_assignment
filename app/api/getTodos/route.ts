import { Todo } from '@/model/todos';
import { promises as fs } from 'fs';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
	try {
	const url = new URL(req.url)
	const filter = url.searchParams.get("filter")
	const file = await fs.readFile(`${process.cwd()}/app/data.json`, 'utf8');
	const data = JSON.parse(file) as Todo[];

	if (filter === 'completed') {
		return Response.json(data.filter(todo => todo.completed === true));
		
	} else if (filter === 'uncompleted') {
		return Response.json(data.filter(todo => todo.completed === false));
	} else {
		return Response.json(data);
	}
	} catch (error) {
        console.error('An error occurred:', error);
        return Response.json({ error: 'Internal Server Error' });
	}

};