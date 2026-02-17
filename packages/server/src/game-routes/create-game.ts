import Elysia, { t } from 'elysia';
import z from 'zod';
import { safeTryPromise } from '../utils/safe-try';
import { db } from '../db';
import { gamesTable, quizzesTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const createGameRoute = new Elysia().post(
	'/',
	async (ctx) => {
		const quizId = z.uuid().safeParse(ctx.body.quizId);

		if (!quizId.success) {
			return ctx.status('Bad Request', 'quiz id should be an uuid');
		}

		const [quizes, quizObtainError] = await safeTryPromise(() =>
			db.select().from(quizzesTable).where(eq(quizzesTable.id, quizId.data))
		);

		if (quizObtainError) {
			console.error(quizObtainError);
			return ctx.status('Internal Server Error', 'Internal Server Error');
		}

		if (quizes.length !== 1) {
			return ctx.status('Not Found');
		}

		const [quiz] = quizes;

		const [games, gameCreationError] = await safeTryPromise(() =>
			db
				.insert(gamesTable)
				.values({
					quiz: {
						title: quiz.title,
						questions: quiz.questions,
					},
					answers: [],
				})
				.returning({ id: gamesTable.id })
		);

		if (gameCreationError) {
			console.error('GCE', gameCreationError);
			return ctx.status('Internal Server Error', 'Internal Server Error');
		}

		const [game] = games;

		return ctx.status('Created', game.id);
	},
	{
		body: t.Object({
			quizId: t.String(),
		}),
	}
);
