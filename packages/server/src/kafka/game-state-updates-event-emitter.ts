import z from "zod";
import { getGameById } from "../cache/game/get_game_by_id";
import type { Game } from "../db/schema";
import { getConsumer, getProducer } from "./kafka";
import { KafkaTopics } from "./topics";

type Callback = (game: Game) => void | Promise<void>;
const listeners: Callback[] = [];
let startedListening = false;

export const notifyGameChanged = async (gameId: string) => {
  const producer = await getProducer();
  await producer.send({
    topic: KafkaTopics.GameStateUpdate,
    messages: [
      {
        value: gameId,
      },
    ],
  });
};

export const onGameStateChanged = async (callback: Callback) => {
  listeners.push(callback);
  if (!startedListening) {
    startedListening = true;
    await startListen();
  }
};

const startListen = async () => {
  const consumer = await getConsumer();
  await consumer.subscribe({ topic: KafkaTopics.GameStateUpdate });

  await consumer.run({
    eachMessage: async ({ message, topic }) => {
      if (topic !== KafkaTopics.GameStateUpdate) {
        return;
      }

      const gameId = z.uuid().safeParse(message.value?.toString());

      if (!gameId.success) {
        return;
      }

      const game = await getGameById(gameId.data);

      if (!game) {
        return;
      }

      for (const callback of listeners) {
        try {
          await callback(game);
        } catch (error) {
          console.error(error);
        }
      }
    },
  });
};
