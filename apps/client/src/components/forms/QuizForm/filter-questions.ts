import type { Question } from './interface';

export const filterQuestions = (questions: Question[]) =>
	questions
		.map((question) => {
			return {
				...question,
				answers: question.answers.filter((answer) => answer.answer.length !== 0),
			};
		})
		.filter((question) => {
			return question.question?.length && question.answers.length;
		});
