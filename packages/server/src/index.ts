import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { gameRoutes } from './game-routes';
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
export { app, cleanup, SocketStatusCode };
