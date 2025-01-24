import { inject, provide } from 'vue';

export const createProvider = <T, Args extends unknown[]>(
	key: string | symbol,
	composable: (...args: Args) => T
): [(...args: Args) => T, () => T] => {
	const keySymbol = typeof key === 'symbol' ? key : Symbol(key);

	const useContext = () => {
		const context = inject<T>(keySymbol);

		if (!context) {
			throw new Error(`Attempted to access context outside of provider for ${keySymbol.toString()}`);
		}

		return context;
	};

	const provideContext = (...args: Args): T => {
		const context = composable(...args);
		provide(keySymbol, context);
		return context;
	};

	return [provideContext, useContext];
};
