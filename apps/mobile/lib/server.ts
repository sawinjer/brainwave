import type { App } from "@brainwave/server/client";
import { treaty } from "@elysiajs/eden";

export const serverUrl =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const server = treaty<App>(serverUrl);
