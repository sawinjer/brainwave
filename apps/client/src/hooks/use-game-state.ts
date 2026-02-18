import { type GameState, PlayerActions } from "@brainwave/server";
import { useEffect, useState } from "react";
import { server } from "@/lib/server";

export const useGameState = (gameId: string, playerName: string) => {
  const [state, setState] = useState<GameState>();

  useEffect(() => {
    const chanel = server.game({ gameId }).subscribe();

    chanel.on("message", (message) => {
      setState(message.data as GameState);
    });

    chanel.send({
      action: PlayerActions.Join,
      playerName,
    });

    return () => {
      chanel.close();
    };
  }, [gameId, playerName]);

  return state;
};
