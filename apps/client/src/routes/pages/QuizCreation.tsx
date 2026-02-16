import { QuizForm } from '@/components/forms/QuizForm/QuizForm';
import { useCreateQuiz } from '@/hooks/use-create-quiz';

export const QuizCreationPage = () => {
	const createQuiz = useCreateQuiz();

	return (
		<div className="p-5 flex flex-col gap-3 items-center">
			<h1 className="text-4xl font-serif text-foreground">Creating a quiz</h1>
			<QuizForm onSubmit={createQuiz.mutate} loading={createQuiz.isPending} />
		</div>
	);
};
