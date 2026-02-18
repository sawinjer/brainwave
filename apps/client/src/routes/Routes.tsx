import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { EditQuizPage } from "./pages/EditQuizPage";
import { MainPage } from "./pages/Main";
import { QuizCreationPage } from "./pages/QuizCreation";
import { ObserveGamePage } from "./pages/ObserveGame";
import { PlayGamePage } from "./pages/PlayGamePage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <MainPage />,
});

const quizCreationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create",
  component: () => <QuizCreationPage />,
});

const editQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/$quizId",
  component: () => <EditQuizPage />,
});

const observeGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game/$gameId",
  component: () => <ObserveGamePage />,
});

const playGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play/$gameId",
  component: () => <PlayGamePage />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  quizCreationRoute,
  editQuizRoute,
  observeGameRoute,
  playGameRoute,
]);
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
