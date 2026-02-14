import { Elysia } from "elysia";

const app = new Elysia()
	.get("/", () => "Hello")
	.get("/health", () => ({ status: "ok" }));

export type App = typeof app;
export { app };
