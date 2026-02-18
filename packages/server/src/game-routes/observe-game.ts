import Elysia from "elysia";
import z from "zod";
import { getGameById } from "../cache/game/get_game_by_id";
import { onGameStateChanged } from "../kafka/game-state-updates-event-emitter";
import { SocketStatusCode } from "../socket-status-codes";
import { gameToReview } from "./game-to-review";
import { getPlayersAmount } from "../cache/playersAmount/get-player-amount";

type Socket = Parameters<
  NonNullable<Parameters<typeof observeGameRoute.ws>[1]["message"]>
>[0];

const connections: Record<string, { [socketId: string]: Socket }> = {};

onGameStateChanged(async (game) => {
  const sockets = Object.values(connections[game.id]);
  for (const socket of sockets) {
    const playersAmount = await getPlayersAmount(game.id);
    socket.send(gameToReview(game, playersAmount));
  }
});

export const observeGameRoute = new Elysia().ws("/observe/:gameId", {
  open: async (socket) => {
    const gameId = z.uuid().safeParse(socket.data.params.gameId);

    if (!gameId.success) {
      socket.close(SocketStatusCode.GameIdHasInvalidFormat);
      return;
    }

    const game = await getGameById(gameId.data);

    if (!game) {
      socket.close(SocketStatusCode.NotFoundGame);
      return;
    }

    if (!connections[gameId.data]) {
      connections[gameId.data] = {};
    }

    connections[gameId.data][socket.id] = socket;
    socket.send(gameToReview(game));
  },
  close: (socket) => {
    Object.entries(connections).forEach((entry) => {
      const socketsList = entry[1];
      delete socketsList[socket.id];
    });
  },
});
