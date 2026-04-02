import { useState } from 'react';

type Callback<R> = () => Promise<R>;

export const useLoading = () => {
	const [loading, setLoading] = useState(0);

	const wrap = <R>(callback: Callback<R>) => {
		return async (): Promise<R> => {
			setLoading((prev) => prev + 1);

			try {
				return await callback();
			} finally {
				setLoading((prev) => Math.max(0, prev - 1));
			}
		};
	};

	return { value: Boolean(loading), wrap };
};
