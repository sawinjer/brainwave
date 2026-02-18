import { TrashIcon } from '@phosphor-icons/react';
import { notFound, useParams } from '@tanstack/react-router';
import type { Quiz } from '@/components/forms/QuizForm/interface';
import { QuizForm } from '@/components/forms/QuizForm/QuizForm';
import { Button } from '@/components/ui/button';
import { useGetQuiz } from '@/hooks/use-get-quiz';
import { useUpdateQuiz } from '@/hooks/use-update-quiz';
import { server } from '@/lib/server';
import { router } from '../Routes';
import { useLoading } from '@/hooks/use-loading';

export const EditQuizPage: React.FC = () => {
	const params = useParams({ from: '/quiz/$quizId' });
	const quiz = useGetQuiz(params.quizId);
	const updateQuiz = useUpdateQuiz();
	const gameCreatingLoading = useLoading();

	const onSubmit = (quiz: Quiz) => {
		updateQuiz.mutate({
			...quiz,
			id: params.quizId,
		});
	};

	const onStartGame = gameCreatingLoading.wrap(async () => {
		const response = await server.game.post({
			quizId: params.quizId,
		});

		const gameId = response.data;

		if (gameId) {
			router.navigate({
				to: '/game/$gameId',
				params: {
					gameId,
				},
			});
		}
	});

	if (!quiz.data && !quiz.isPending) {
		notFound();
	}

	return (
		<div className="p-5 flex flex-col items-center">
			<div className="max-w-[560px] w-full flex flex-col gap-3">
				<h1 className="text-4xl font-serif text-foreground">
					{quiz.data?.title || 'Loading...'}
				</h1>
				<div className="flex items-center w-full gap-2 flex-wrap">
					<span>Actions: </span>
					<Button disabled={gameCreatingLoading.value} onClick={onStartGame}>
						Start a quiz
					</Button>
					<Button variant="destructive">
						<TrashIcon />
						Delete
					</Button>
				</div>
				<h2 className="text-2xl font-serif text-foreground">Edit your quiz:</h2>
				{quiz.data && (
					<QuizForm
						initialValue={quiz.data}
						onSubmit={onSubmit}
						loading={updateQuiz.isPending}
					/>
				)}
			</div>
		</div>
	);
};
