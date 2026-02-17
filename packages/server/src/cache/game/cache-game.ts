import { redis } from 'bun';
import type { Game } from '../../db/schema';
import { gameCacheKey } from './game_cache_key';

export const cacheGame = async (game: Game) => {
	await redis.set(gameCacheKey(game.id), JSON.stringify(game));
};
