import { eq } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import { db } from '../db';
import { quizzesTable } from '../db/schema';
import { safeTryPromise } from '../utils/safe-try';

const bodySchema = t.Object({
	id: t.String(),
	title: t.String(),
	questions: t.Array(
		t.Object({
			id: t.Optional(t.String()),
			question: t.String(),
			answers: t.Array(
				t.Object({
					id: t.Optional(t.String()),
					answer: t.String(),
					isCorrect: t.Boolean(),
				})
			),
		})
	),
});

export const updateQuizRoute = new Elysia().patch(
	'/',
	async (ctx) => {
		const body = ctx.body;

		const [, error] = await safeTryPromise(async () => {
			await db
				.update(quizzesTable)
				.set({
					title: body.title,
					questions: body.questions,
				})
				.where(eq(quizzesTable.id, body.id));
		});

		if (error) {
			console.error(error);
			return ctx.status('Internal Server Error', 'Internal Server Error');
		}

		return 'Success';
	},
	{
		body: bodySchema,
	}
);
