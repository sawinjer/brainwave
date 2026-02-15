import Elysia from 'elysia';
import { createQuizRoute } from './create-quiz';
import { getQuizRoute } from './get-quiz';
import { updateQuizRoute } from './update-quiz';

export const quizRoutes = new Elysia({
	prefix: '/quiz',
})
	.use(createQuizRoute)
	.use(updateQuizRoute)
	.use(getQuizRoute);
