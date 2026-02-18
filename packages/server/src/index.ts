import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { gameRoutes } from './game-routes';
import type { GameState as GameStateType } from './game-routes/game-to-game-state';
import type { GameReview as GameReviewType } from './game-routes/game-to-review';
import { disconnectProducer } from './kafka/kafka';
import { quizRoutes } from './quiz-routes';
import { SocketStatusCode } from './socket-status-codes';

const app = new Elysia()
	.use(cors())
	.use(quizRoutes)
	.use(gameRoutes)
	.get('/health', () => ({ status: 'ok' }));

const cleanup = async () => {
	await disconnectProducer();
	await app.stop();
};

export type App = typeof app;
export type GameReview = GameReviewType;
export type GameState = GameStateType;

export { app, cleanup, SocketStatusCode };
