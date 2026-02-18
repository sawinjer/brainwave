import { redis } from 'bun';
import { playersAmountKey, playersAmountKeyPrefix } from './players-amount-key';

export const joinPlayer = async (gameId: string, playerName: string) => {
	const connectionAmount = await redis.incr(playersAmountKey(gameId, playerName));

	if (connectionAmount === 1) {
		await redis.incr(playersAmountKeyPrefix(gameId));
	}

	return connectionAmount;
};

export const playerLeave = async (gameId: string, playerName: string) => {
	const key = playersAmountKey(gameId, playerName);
	const newAmount = await redis.decr(key);

	if (newAmount <= 0) {
		await redis.decr(playersAmountKeyPrefix(gameId));
		await redis.del(key);
	}

	return Math.max(newAmount, 0);
};
