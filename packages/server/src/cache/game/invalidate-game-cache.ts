import { redis } from 'bun';
import { gameCacheKey } from './game_cache_key';

export const invalidateGameCache = async (id: string) => {
	await redis.del(gameCacheKey(id));
};
