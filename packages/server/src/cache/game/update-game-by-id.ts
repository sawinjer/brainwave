import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { type Game, gamesTable } from '../../db/schema';
import { invalidateGameCache } from './invalidate-game-cache';

export async function updateGameById(id: string, game: Partial<Game>) {
	await db.update(gamesTable).set(game).where(eq(gamesTable.id, id));
	await invalidateGameCache(id);
}
