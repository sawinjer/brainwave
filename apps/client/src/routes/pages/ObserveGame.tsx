import { CopyIcon } from "@phosphor-icons/react";
import { Link, useParams } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useGameReview } from "@/hooks/use-game-review";
import { useGoToNextQuestion } from "@/hooks/use-go-to-next-question";

export const ObserveGamePage = () => {
  const params = useParams({ from: "/game/$gameId" });
  const game = useGameReview(params.gameId);
  const gameUrl = new URL(`/play/${params.gameId}`, window.location.origin);
  const goToNextQuestion = useGoToNextQuestion(params.gameId);

  const copyGameLink = () => {
    navigator.clipboard.writeText(gameUrl.toString());
  };

  if (!game) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-serif text-foreground">Connecting...</h1>
      </div>
    );
  }

  const prevQuestion = game.quiz.questions[game.currentQuestionIndex - 1];
  const prevAnswers = game.answers[game.currentQuestionIndex - 1];
  const prevQuestionCorrectAnswers = prevQuestion?.answers
    .map((answer, index) => ({ ...answer, index }))
    .filter((answer) => answer.isCorrect);

  const currentQuestion = game.quiz.questions[game.currentQuestionIndex];
  const answers = game.answers[game.currentQuestionIndex];

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-8 relative">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-serif text-foreground">
          Players connected - {game.playersAmount || 0}
        </h2>
        <h1 className="text-4xl font-serif text-foreground">
          {currentQuestion?.question || "It was the last question"}
        </h1>
        <ul>
          {currentQuestion?.answers.map((answer, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <there is no workaround>
            <li key={index}>
              {answer.answer} ({answers?.[index] || 0})
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => goToNextQuestion.mutate()}
            disabled={goToNextQuestion.isPending}
          >
            Go to next question
          </Button>
        </div>
      </div>
      {prevQuestion && (
        <div className="flex flex-col gap-2 items-center">
          <h3 className="text-2xl font-serif text-foreground">
            {prevQuestion?.question || "n/a"}
          </h3>
          <span>Correct answers: </span>
          <ul>
            {prevQuestionCorrectAnswers?.map((answer) => (
              <li key={answer.index}>
                {answer.answer} ({prevAnswers?.[answer.index] || 0})
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 items-center">
        <div className="bg-white p-3 rounded-md w-min h-min">
          <QRCodeSVG value={gameUrl.toString()} />
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/play/$gameId" params={params} target="_blank">
              Join the game
            </Link>
          </Button>
          <Button variant="outline" size="icon" onClick={copyGameLink}>
            <CopyIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
