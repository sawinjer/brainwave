import type { App } from '@brainwave/server/client';
import { treaty } from '@elysiajs/eden';

const serverUrl = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000';

export const server = treaty<App>(serverUrl);
