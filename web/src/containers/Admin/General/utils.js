import React from 'react';
import { Select } from 'antd';

import { CurrencyBall } from '../../../components';
import { validateRequired } from '../../../components/AdminForm/validations';
import LANGUAGES from '../../../config/languages';

const renderCoinOptions = (coins = {}) =>
	Object.keys(coins).map((symbol, index) => {
		const coinData = coins[symbol];
		return (
			<Select.Option key={index} value={symbol}>
				<div className="asset-list">
					<CurrencyBall symbol={symbol} name={symbol} size="m" />
					<div className="select-coin-text">{coinData.fullname}</div>
				</div>
			</Select.Option>
		);
	});

export const getGeneralFields = (coins) => ({
	section_1: {
		api_name: {
			type: 'text',
			placeholder: 'enter exchange name',
			validate: [validateRequired],
		},
	},
	section_2: {
		language: {
			type: 'select',
			// mode: 'multiple',
			options: LANGUAGES,
			disabled: true,
			validate: [validateRequired],
		},
	},
	section_3: {
		theme: {
			type: 'select',
			options: [
				{ label: 'White', value: 'white' },
				{ label: 'Dark', value: 'dark' },
			],
			disabled: true,
			validate: [validateRequired],
		},
	},
	section_4: {
		native_currency: {
			type: 'select',
			options: coins,
			renderOptions: () => renderCoinOptions(coins),
			validate: [validateRequired],
		},
	},
	section_5: {
		description: {
			type: 'textarea',
			label: 'Write description',
			placeholder: 'Write a short description or slogan...',
			validate: [validateRequired],
		},
	},
	section_6: {
		terms: {
			type: 'input',
			label: 'Terms of service link',
			placeholder: 'https://',
		},
		privacy: {
			type: 'input',
			label: 'Privacy policy link',
			placeholder: 'https://',
		},
	},
	section_7: {
		helpdesk: {
			type: 'input',
			label: 'Help desk',
			placeholder: 'http://',
		},
	},
	section_8: {
		hide_referral_badge: {
			type: 'checkbox',
			label: 'Hide referral badge',
		},
		referral_label: {
			type: 'input',
			label: 'Text label',
			placeholder: 'Powered by bitHolla',
		},
		referral_link: {
			type: 'input',
			label: 'Link',
			placeholder: 'https://bitholla.com/',
		},
	},
	section_9: {
		api_doc_link: {
			type: 'input',
			label: 'API doc link',
			placeholder: 'http://',
		},
	},
});
