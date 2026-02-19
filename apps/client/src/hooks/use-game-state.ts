import { type GameState, PlayerActions } from "@brainwave/server/client";
import { useEffect, useState } from "react";
import { server } from "@/lib/server";

type AnswerVote = (answerIndex: number) => void;

export const useGameState = (gameId: string, playerName: string) => {
  const [state, setState] = useState<GameState>();
  const [vote, setVote] = useState<AnswerVote>(() => {});

  useEffect(() => {
    const chanel = server.game({ gameId }).subscribe();

    chanel.on("message", (message) => {
      setState(message.data as GameState);
    });

    chanel.on("open", () => {
      chanel.send({
        action: PlayerActions.Join,
        playerName,
      });
    });

    setVote(() => {
      return (answerIndex: number) => {
        chanel.send({
          action: PlayerActions.AnswerVote,
          playerName,
          votedAnswer: answerIndex,
        });
      };
    });

    return () => {
      chanel.close();
    };
  }, [gameId, playerName]);

  return { state, vote };
};
