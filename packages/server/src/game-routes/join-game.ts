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

			const [game] = safeTry<schema.Game>(
				() => message.value && JSON.parse(message.value.toString())
			);

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

		const producer = await getProducer();

		switch (socket.body.action) {
			case PlayerActions.Join:
				if (!connections[game.id]) {
					connections[game.id] = {};
				}

				connections[game.id][socket.id] = {
					socket,
					playerName: socket.body.playerName,
				};

				socket.send(gameToGameState(game, socket.body.playerName));
				break;
			case PlayerActions.AnswerVote:
				await db.update(schema.gamesTable).set({
					answers: setAnswerToGame(game, socket.body.playerName, socket.body.votedAnswer),
				});
				await invalidateGameCache(game.id);

				await producer.send({
					topic: KafkaTopics.GameStateUpdate,
					messages: [
						{
							value: JSON.stringify(game),
						},
					],
				});
				break;
		}
	},
	close: (socket) => {
		Object.entries(connections).forEach((entry) => {
			const socketsList = entry[1];
			delete socketsList[socket.id];
		});
	},
	body: bodySchema,
});

type Socket = Parameters<NonNullable<Parameters<typeof joinGameRoute.ws>[1]['message']>>[0];
