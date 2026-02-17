import type { Game } from '../db/schema';

export const gameToGameState = (game: Game, playerName: string) => {
	return {
		...game,
		answers: game.answers.map((answers) => answers[playerName]),
		totalAnswersAmount: game.answers.map((answer) => Object.keys(answer).length),
	};
};
