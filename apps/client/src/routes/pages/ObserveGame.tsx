import { useParams } from "@tanstack/react-router";
import { useGameReview } from "@/hooks/use-game-review";

export const ObserveGame = () => {
  const params = useParams({ from: "/game/$gameId" });
  const game = useGameReview(params.gameId);

  if (!game) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-serif text-foreground">Connecting...</h1>
      </div>
    );
  }

  const currentQuestion = game.quiz.questions[game.currentQuestionIndex];
  const answers = game.answers[game.currentQuestionIndex];

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-2">
      <h2 className="text-2xl font-serif text-foreground">
        Players connected - {game.playersAmount || 0}
      </h2>
      <h1 className="text-4xl font-serif text-foreground">
        {currentQuestion?.question || "n/a"}
      </h1>
      <ul>
        {currentQuestion?.answers.map((answer, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <there is no workaround>
          <li key={index}>
            {answer.answer} ({answers?.[index] || 0})
          </li>
        ))}
      </ul>
    </div>
  );
};
