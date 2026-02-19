import Elysia from "elysia";
import z from "zod";
import { getGameById } from "../cache/game/get_game_by_id";
import { updateGameById } from "../cache/game/update-game-by-id";
import { notifyGameChanged } from "../kafka/game-state-updates-event-emitter";

export const moveToNextQuestionRoute = new Elysia().post(
  "/:gameId/next-question",
  async (ctx) => {
    const gameId = z.uuid().safeParse(ctx.params.gameId);

    if (!gameId.success) {
      return ctx.status(
        "Bad Request",
        "Gamed id in the path has invalid format",
      );
    }

    const game = await getGameById(gameId.data);

    if (!game) {
      return ctx.status("Not Found");
    }

    if (game.quiz.questions.length === game.currentQuestionIndex) {
      return game.currentQuestionIndex;
    }

    await updateGameById(gameId.data, {
      currentQuestionIndex: game.currentQuestionIndex + 1,
    });
    await notifyGameChanged(gameId.data);

    return game.currentQuestionIndex + 1;
  },
);
