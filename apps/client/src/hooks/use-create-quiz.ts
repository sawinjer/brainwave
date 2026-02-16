import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import type { Quiz } from '@/components/forms/QuizForm/interface';
import { queryKeys } from '@/constants/query-keys';
import { server } from '@/lib/server';

export const useCreateQuiz = () => {
	const router = useRouter();

	return useMutation({
		mutationKey: queryKeys.createQuiz,
		mutationFn: async (quiz: Quiz) => {
			const { data, error } = await server.quiz.post(quiz);

			if (data) {
				router.navigate({
					to: '/quiz/$quizId',
					params: {
						quizId: data.quizId,
					},
				});
			}

			if (error) {
				console.error(error); //TODO: show notification
			}
		},
	});
};
