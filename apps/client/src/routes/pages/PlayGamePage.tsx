import { useParams } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const PlayGamePage = () => {
  const params = useParams({ from: "/play/$gameId" });
  const [playerName] = useLocalStorage("playerName", nanoid());
  const { state, vote } = useGameState(params.gameId, playerName);

  if (!state) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-serif text-foreground">Connecting...</h1>
      </div>
    );
  }

  const currentQuestion = state.quiz.questions[state.currentQuestionIndex];

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-2">
      <h1 className="text-4xl font-serif text-foreground">
        {currentQuestion?.question || "Quiz finished"}
      </h1>
      <div className="flex flex-col gap-2">
        {currentQuestion?.answers.map((answer, index) => (
          <Button
            className="min-w-[120px]"
            variant={
              state.answers[state.currentQuestionIndex] === index
                ? "default"
                : "outline"
            }
            onClick={() => vote(index)}
            // biome-ignore lint/suspicious/noArrayIndexKey: <there is no workaround>
            key={index}
          >
            {answer.answer}
          </Button>
        ))}
      </div>
    </div>
  );
};
