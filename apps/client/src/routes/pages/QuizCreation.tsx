import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const QuizCreationPage = () => {
	return (
		<div className="dark w-screen h-screen bg-background flex flex-col gap-3 items-center justify-center">
			<h1 className="text-4xl font-serif text-foreground">Creating a quiz🧠</h1>
			<div className="flex gap-2 justify-center">
				<Button asChild>
					<Link to="/">Back to home</Link>
				</Button>
			</div>
		</div>
	);
};
