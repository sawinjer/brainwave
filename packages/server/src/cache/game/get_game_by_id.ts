import { redis } from 'bun';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { type Game, gamesTable } from '../../db/schema';
import { safeTryPromise } from '../../utils/safe-try';
import { cacheGame } from './cache-game';
import { gameCacheKey } from './game_cache_key';

export const getGameById = async (id: string) => {
	const [cached] = await safeTryPromise(async () => {
		const game = await redis.get(gameCacheKey(id));

		if (!game) {
			return null;
		}

		return JSON.parse(game);
	});

	if (cached) {
		return cached as Game;
	}

	const [response] = await safeTryPromise(async () =>
		db.select().from(gamesTable).where(eq(gamesTable.id, id))
	);
	const game = response?.[0] as Game | undefined;

	if (game) {
		await cacheGame(game);
	}

	return game;
};
