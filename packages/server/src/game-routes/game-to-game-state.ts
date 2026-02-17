import type { Game } from '../db/schema';

export const gameToGameState = (game: Game, playerName: string) => {
	return {
		...game,
		quiz: {
			title: game.quiz.title,
			questions: game.quiz.questions.map((question) => {
				return {
					...question,
					answers: question.answers.map((answer) => ({ answer: answer.answer })),
				};
			}),
		},
		answers: game.answers.map((answers) => answers[playerName]),
		totalAnswersAmount: game.answers.map((answer) => Object.keys(answer).length),
	};
};
