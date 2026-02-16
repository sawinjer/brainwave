import { nanoid } from 'nanoid';
import type { Quiz } from '@/components/forms/QuizForm/interface';

export const responseToQuiz = (response: { title: string; questions: unknown }): Quiz => {
	const questions = response.questions as Quiz['questions'];

	return {
		title: response.title,
		questions: questions.map((question) => ({
			...question,
			id: nanoid(),
			answers: question.answers.map((answer) => ({
				...answer,
				id: nanoid(),
			})),
		})),
	};
};
