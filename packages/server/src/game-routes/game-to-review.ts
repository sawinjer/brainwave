import type { Game } from "../db/schema";

export const gameToReview = (game: Game, playersAmount: number) => {
  const answers = game.answers.map((answers) => {
    const popularity = Object.values(answers).reduce<Record<number, number>>(
      (acc, answer) => {
        if (!acc[answer]) {
          acc[answer] = 0;
        }

        acc[answer] += 1;
        return acc;
      },
      {},
    );

    return popularity;
  });

  const questions = game.quiz.questions.map((question, index) => {
    if (index < game.currentQuestionIndex) {
      return question;
    }

    return {
      ...question,
      answers: question.answers.map((answer) => ({
        answer: answer.answer,
        isCorrect: false,
      })),
    };
  });

  return {
    ...game,
    playersAmount,
    answers,
    quiz: {
      ...game.quiz,
      questions,
    },
  };
};

export type GameReview = ReturnType<typeof gameToReview>;
