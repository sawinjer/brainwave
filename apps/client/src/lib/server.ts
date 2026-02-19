import type { App } from '@brainwave/server/client';
import { treaty } from '@elysiajs/eden';

export const server = treaty<App>('localhost:3000');
