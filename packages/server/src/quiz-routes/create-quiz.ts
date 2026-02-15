import Elysia, { t } from 'elysia';
import { db } from '../db';
import { quizzesTable } from '../db/schema';
import { safeTryPromise } from '../utils/safe-try';

export const createQuizRoute = new Elysia().post(
	'/',
	async (ctx) => {
		const quizToCreate = ctx.body;
		const [response, error] = await safeTryPromise(async () => {
			return await db
				.insert(quizzesTable)
				.values({
					title: quizToCreate.title,
					questions: quizToCreate.questions,
				})
				.returning({ id: quizzesTable.id });
		});

		if (error || response.length !== 1) {
			return ctx.status('Internal Server Error', 'Internal Server Error');
		}

		const [{ id }] = response;
		return ctx.status('Created', { quizId: id });
	},
	{
		body: t.Object({
			title: t.String(),
			questions: t.Array(
				t.Object({
					question: t.String(),
					answers: t.Array(
						t.Object({
							answer: t.String(),
							isCorrect: t.Boolean(),
						})
					),
				})
			),
		}),
	}
);
