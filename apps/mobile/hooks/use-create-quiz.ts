import type { Quiz } from '@/components/forms/QuizForm/interface';
import { queryKeys } from '@/constants/query-keys';
import { server } from '@/lib/server';
import { useMutation } from '@tanstack/react-query';

export const useCreateQuiz = () => {
	return useMutation({
		mutationKey: queryKeys.createQuiz,
		mutationFn: async (quiz: Quiz) => {
			const { data, error } = await server.quiz.post(quiz);

			if (error) {
				console.error(error);
				throw error;
			}

			return data;
		},
	});
};
