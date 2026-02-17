import Elysia from 'elysia';
import { createGameRoute } from './create-game';
import { joinGameRoute } from './join-game';
import { observeGameRoute } from './observe-game';

export const gameRoutes = new Elysia({ prefix: '/game' })
	.use(createGameRoute)
	.use(joinGameRoute)
	.use(observeGameRoute);
