import { eq } from 'drizzle-orm';
import Elysia from 'elysia';
import z from 'zod';
import { db } from '../db';
import { quizzesTable } from '../db/schema';
import { safeTryPromise } from '../utils/safe-try';

export const getQuizRoute = new Elysia().get('/:id', async (ctx) => {
	const id = z.uuid().safeParse(ctx.params.id);

	if (!id.success) {
		return ctx.status('Bad Request', 'Id should be an uuid');
	}

	const [response, err] = await safeTryPromise(async () => {
		return await db.select().from(quizzesTable).where(eq(quizzesTable.id, id.data));
	});

	if (err) {
		console.error(err);
		return ctx.status('Internal Server Error', 'Internal Server Error');
	}

	const [quiz] = response;

	if (!quiz) {
		return ctx.status('Not Found');
	}

	return quiz;
});
