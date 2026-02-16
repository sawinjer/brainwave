import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { EditQuizPage } from './pages/EditQuizPage';
import { MainPage } from './pages/Main';
import { QuizCreationPage } from './pages/QuizCreation';

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
	path: '/',
	component: () => <MainPage />,
});

const quizCreationRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/create',
	component: () => <QuizCreationPage />,
});

const editQuizRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/quiz/$quizId',
	component: () => <EditQuizPage />,
});

const routeTree = rootRoute.addChildren([indexRoute, quizCreationRoute, editQuizRoute]);
export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
