import Elysia, { t } from "elysia";
import z from "zod";
import { getGameById } from "../cache/game/get_game_by_id";
import { updateGameById } from "../cache/game/update-game-by-id";
import {
  notifyGameChanged,
  onGameStateChanged,
} from "../kafka/game-state-updates-event-emitter";
import { SocketStatusCode } from "../socket-status-codes";
import { gameToGameState } from "./game-to-game-state";
import { PlayerActions } from "./player-actions";
import { setAnswerToGame } from "./set-answer-to-game";
import {
  joinPlayer,
  playerLeave,
} from "../cache/playersAmount/update-players-amount";

const authPayload = {
  playerName: t.String(),
};

const joinPayload = t.Object({
  ...authPayload,
  action: t.Literal(PlayerActions.Join),
});

const votedAnswer = t.Object({
  ...authPayload,
  action: t.Literal(PlayerActions.AnswerVote),
  votedAnswer: t.Integer(),
});

const bodySchema = t.Union([joinPayload, votedAnswer]);
const connections: Record<
  string,
  { [socketId: string]: { socket: Socket; playerName: string } }
> = {};

onGameStateChanged((game) => {
  const sockets = Object.values(connections[game.id]);
  for (const { socket, playerName } of sockets) {
    socket.send(gameToGameState(game, playerName));
  }
});

export const joinGameRoute = new Elysia().ws("/:gameId", {
  message: async (socket) => {
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

    switch (socket.body.action) {
      case PlayerActions.Join:
        if (!connections[game.id]) {
          connections[game.id] = {};
        }

        if (socket.id in connections[game.id]) {
          socket.send(gameToGameState(game, socket.body.playerName));
          return;
        }

        connections[game.id][socket.id] = {
          socket,
          playerName: socket.body.playerName,
        };

        socket.send(gameToGameState(game, socket.body.playerName));
        await joinPlayer(game.id, socket.body.playerName);
        await notifyGameChanged(game.id);
        break;
      case PlayerActions.AnswerVote:
        await updateGameById(game.id, {
          answers: setAnswerToGame(
            game,
            socket.body.playerName,
            socket.body.votedAnswer,
          ),
        });
        await notifyGameChanged(game.id);

        break;
    }
  },
  close: async (socket) => {
    for (const entry of Object.entries(connections)) {
      const [gameId, socketsList] = entry;

      if (!(socket.id in socketsList)) {
        continue;
      }

      const playerName = socketsList[socket.id]?.playerName;

      if (playerName) {
        await playerLeave(gameId, playerName);
        await notifyGameChanged(gameId);
      }

      delete socketsList[socket.id];
    }
  },
  body: bodySchema,
});

type Socket = Parameters<
  NonNullable<Parameters<typeof joinGameRoute.ws>[1]["message"]>
>[0];
