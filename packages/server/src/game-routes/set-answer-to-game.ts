import type { Game } from '../db/schema';

export const setAnswerToGame = (game: Game, playerName: string, answer: number) => {
	const answers = game.answers;

	if (!answers[game.currentQuestionIndex]) {
		answers[game.currentQuestionIndex] = {};
	}

	return game.answers.map((answers, index) => {
		if (index !== game.currentQuestionIndex) {
			return answers;
		}

		return {
			...answers,
			[playerName]: answer,
		};
	});
};
