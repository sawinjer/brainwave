import cors from "@elysiajs/cors";
import { Elysia } from "elysia";

const app = new Elysia()
	.use(cors())
	.get("/", () => "Hello from elysia")
	.get("/health", () => ({ status: "ok" }));

export type App = typeof app;
export { app };
