import { redis } from 'bun';
import { playersAmountKeyPrefix } from './players-amount-key';

export const getPlayersAmount = async (gameId: string) => {
	const value = await redis.get(playersAmountKeyPrefix(gameId));

	const amount = parseInt(value || '0', 10);

	if (Number.isNaN(amount)) {
		return 0;
	}

	return amount;
};
