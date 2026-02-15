import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { quizRoutes } from './quiz-routes';

const app = new Elysia()
	.use(cors())
	.use(quizRoutes)
	.get('/', () => 'Hello from elysia')
	.get('/health', () => ({ status: 'ok' }));

export type App = typeof app;
export { app };
