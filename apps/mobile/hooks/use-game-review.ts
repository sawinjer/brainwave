import type { GameReview } from '@brainwave/server/client';
import { useEffect, useState } from 'react';
import { server } from '@/lib/server';

export const useGameReview = (gameId: string) => {
	const [review, setReview] = useState<GameReview>();

	useEffect(() => {
		const channel = server.game
			.observe({
				gameId,
			})
			.subscribe();

		channel.on('message', (gameReview) => {
			setReview(gameReview.data as GameReview);
		});

		return () => {
			channel.close();
		};
	}, [gameId]);

	return review;
};
