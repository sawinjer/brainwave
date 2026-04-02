import { randomUUID } from "expo-crypto";
import type { Quiz } from "@/components/forms/QuizForm/interface";

export const responseToQuiz = (response: {
  title: string;
  questions: unknown;
}) => {
  const questions = response.questions as Quiz["questions"];

  return {
    title: response.title,
    questions: questions.map((question) => ({
      ...question,
      id: randomUUID(),
      answers: question.answers.map((answer) => ({
        ...answer,
        id: randomUUID(),
      })),
    })),
  };
};
