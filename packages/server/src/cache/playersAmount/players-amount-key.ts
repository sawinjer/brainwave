export const playersAmountKeyPrefix = (gameId: string) => `players-amount:${gameId}`;
export const playersAmountKey = (gameId: string, playerName: string) =>
	`${playersAmountKeyPrefix(gameId)}:${playerName}`;
