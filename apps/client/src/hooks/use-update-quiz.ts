import type { Quiz } from '@/components/forms/QuizForm/interface';
import { queryKeys } from '@/constants/query-keys';
import { server } from '@/lib/server';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateQuiz = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: queryKeys.updateQuiz,
		mutationFn: async (quiz: Quiz & { id: string }) => {
			const { error } = await server.quiz.patch(quiz);

			if (error) {
				console.error(error); //TODO: show notification
				throw error;
			}

			return quiz.id;
		},
		onSuccess: (id) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.getQuiz(id),
			});
		},
	});
};
