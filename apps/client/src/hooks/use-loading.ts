import { useState } from 'react';

type Callback<R> = () => Promise<R>;

export const useLoading = () => {
	const [loading, setLoading] = useState(0);

	const wrap = <R>(callback: Callback<R>) => {
		return async (): Promise<R> => {
			setLoading((prev) => prev + 1);

			try {
				return await callback();
			} catch (err) {
				// biome-ignore lint/complexity/noUselessCatch: <it used here in order to have finally step>
				throw err;
			} finally {
				setLoading((prev) => Math.max(0, prev - 1));
			}
		};
	};
	return { value: Boolean(loading), wrap };
};
