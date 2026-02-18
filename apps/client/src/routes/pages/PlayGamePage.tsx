import { useParams } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import { useGameState } from "@/hooks/use-game-state";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const PlayGamePage = () => {
  const params = useParams({ from: "/play/$gameId" });
  const [playerName] = useLocalStorage("playerName", nanoid());
  const state = useGameState(params.gameId, playerName);

  console.log("[STATE]", state);

  return <div></div>;
};
