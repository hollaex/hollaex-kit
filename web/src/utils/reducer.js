import { generateCoinIconId } from 'utils/icon';
import { DEFAULT_COIN_DATA } from 'config/constants';

export const modifyCoinsData = (coins) => {
	Object.entries(coins).forEach(([key, data]) => {
		const { display_name } = data;
		data.display_name = (display_name ? display_name : key).toUpperCase();
		data.icon_id = generateCoinIconId(key);
	});

	return coins;
};

export const modifyPairsData = (pairs, coins) => {
	Object.entries(pairs).forEach(([key, data]) => {
		const { pair_base, pair_2 } = data;
		const { display_name: pair_base_display, icon_id } =
			coins[pair_base] || DEFAULT_COIN_DATA;
		const { display_name: pair_2_display } = coins[pair_2] || DEFAULT_COIN_DATA;
		const display_name = `${pair_base_display}/${pair_2_display}`;

		data.pair_base_display = pair_base_display;
		data.pair_2_display = pair_2_display;
		data.display_name = display_name;
		data.icon_id = icon_id;
	});

	return pairs;
};

export const modifyBrokerData = (broker, coins) => {
	broker.forEach((data) => {
		const { symbol = '' } = data;
		const [pair_base, pair_2] = symbol?.split('-');
		const { display_name: pair_base_display, icon_id } =
			coins[pair_base] || DEFAULT_COIN_DATA;
		const { display_name: pair_2_display } = coins[pair_2] || DEFAULT_COIN_DATA;
		const display_name = `${pair_base_display}/${pair_2_display}`;

		data.display_name = display_name;
		data.icon_id = icon_id;
	});

	return broker;
};
