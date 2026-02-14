import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const MainPage = () => {
	return (
		<div className="dark w-screen h-screen bg-background flex flex-col gap-3 items-center justify-center">
			<h1 className="text-4xl font-serif text-foreground">Hello there, in BrainWave 🧠</h1>
			<div className="flex gap-2 justify-center">
				<Button asChild>
					<Link to="/create">Create a quiz</Link>
				</Button>
				<Button>Join a quiz</Button>
				<Button>Specteta a quiz</Button>
			</div>
		</div>
	);
};
