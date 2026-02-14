import { Elysia, t } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello")
  .get("/health", () => ({ status: "ok" }));

export type App = typeof app;
export { app };
export { t };
