import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { responseToQuiz } from '@/lib/reponse-to-quiz';
import { server } from '@/lib/server';

export const useGetQuiz = (id: string) => {
	return useQuery({
		queryKey: queryKeys.getQuiz(id),
		queryFn: async () => {
			const { data, error } = await server.quiz({ id }).get();

			if (error) {
				console.error(error);
			}

			if (!data) {
				return undefined;
			}

			return responseToQuiz(data);
		},
	});
};
