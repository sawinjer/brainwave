import Elysia, { t } from 'elysia';
import z from 'zod';
import { getGameById } from '../cache/game/get_game_by_id';
import { invalidateGameCache } from '../cache/game/invalidate-game-cache';
import { db } from '../db';
import * as schema from '../db/schema';
import { getConsumer, getProducer } from '../kafka/kafka';
import { KafkaTopics } from '../kafka/topics';
import { SocketStatusCode } from '../socket-status-codes';
import { safeTry } from '../utils/safe-try';
import { gameToGameState } from './game-to-game-state';
import { PlayerActions } from './player-actions';
import { setAnswerToGame } from './set-answer-to-game';
import { updateGameById } from '../cache/game/update-game-by-id';

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
const connections: Record<string, { [socketId: string]: { socket: Socket; playerName: string } }> =
	{};

getConsumer().then(async (consumer) => {
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

			const sockets = Object.values(connections[game.id]);
			for (const { socket, playerName } of sockets) {
				socket.send(gameToGameState(game, playerName));
			}
		},
	});
});

const notifyGameChanged = async (gameId: string) => {
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

export const joinGameRoute = new Elysia().ws('/:gameId', {
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

				connections[game.id][socket.id] = {
					socket,
					playerName: socket.body.playerName,
				};

				await updateGameById(game.id, {
					playersAmount: game.playersAmount + 1,
				});
				await notifyGameChanged(game.id);
				break;
			case PlayerActions.AnswerVote:
				await updateGameById(game.id, {
					answers: setAnswerToGame(game, socket.body.playerName, socket.body.votedAnswer),
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

			const game = await getGameById(gameId);

			if (game) {
				await updateGameById(gameId, {
					playersAmount: Math.max(0, game.playersAmount - 1),
				});

				await notifyGameChanged(gameId);
			}

			delete socketsList[socket.id];
		}
		Object.entries(connections).forEach((entry) => {
			const socketsList = entry[1];
			delete socketsList[socket.id];
		});
	},
	body: bodySchema,
});

type Socket = Parameters<NonNullable<Parameters<typeof joinGameRoute.ws>[1]['message']>>[0];
