export const updateInputValue = <E extends HTMLElement>(
	callback: (value: string) => void
): React.ChangeEventHandler<E> => {
	return (e) => {
		const target = e.target;

		if (!('value' in target)) {
			return;
		}

		callback(target.value as string);
	};
};
