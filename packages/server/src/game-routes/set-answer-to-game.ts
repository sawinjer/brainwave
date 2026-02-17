import type { Game } from '../db/schema';

export const setAnswerToGame = (game: Game, playerName: string, answer: number) => {
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
