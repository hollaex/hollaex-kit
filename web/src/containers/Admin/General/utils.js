import React from 'react';
import { Select } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import { CurrencyBall } from '../../../components';
import { validateRequired } from '../../../components/AdminForm/validations';
import LANGUAGES from '../../../config/languages';
import { COUNTRIES_OPTIONS } from '../../../utils/countries';
import { STATIC_ICONS } from 'config/icons';
import { getFormatTimestamp } from 'utils/utils';

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

const renderCountries = () => {
	return COUNTRIES_OPTIONS?.map(({ value, label, icon }) => (
		<Select.Option key={value} value={value}>
			<span className="language-lists">
				{icon}
				<span className="selected-language">{label}</span>
			</span>
		</Select.Option>
	));
};

const renderFlag = () => {
	return LANGUAGES?.map(({ value, label, icon }) => (
		<Select.Option key={value} value={value}>
			<span className="language-lists">
				<img src={icon} alt={`${label}-icon`} className="language-icon" />
				<span className="selected-language">{label}</span>
			</span>
		</Select.Option>
	));
};

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
			renderOptions: () => renderFlag(),
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
			placeholder: 'Powered by HollaEx',
		},
		referral_link: {
			type: 'input',
			label: 'Link',
			placeholder: 'https://hollaex.com/',
		},
	},
	section_9: {
		api_doc_link: {
			type: 'input',
			label: 'API doc link',
			placeholder: 'http://',
		},
	},
	section_10: {
		site_key: {
			type: 'input',
			label: 'Site key',
			placeholder: 'Site key',
		},
		secret_key: {
			type: 'password',
			label: 'Secret key',
			placeholder: 'Secret key',
		},
	},
	countrySection: {
		country: {
			type: 'select',
			options: COUNTRIES_OPTIONS,
			renderOptions: () => renderCountries(),
			validate: [validateRequired],
		},
	},
});

export const publishJSON = [
	{
		title: 'Exchange logo',
		description:
			'This logo will be applied to emails send to your users and login screen, footer and other places. Any custom graphics uploaded via the direct edit function will override the logo.',
		currentkey: 'EXCHANGE_LOGO',
	},
	{
		title: 'Loader',
		description: 'Used for areas that require loading.Also known as a spinner.',
		currentkey: 'EXCHANGE_LOADER',
	},
	{
		title: 'Exchange favicon',
		description: '',
		currentkey: 'EXCHANGE_FAV_ICON',
		themeKey: 'dark',
		indexKey: 'EXCHANGE_1',
	},
];

export const generateHeaders = (handleEditData) => {
	return [
		{
			stringId: 'role',
			label: 'Key type',
			key: 'role',
			renderCell: ({ id, role }, key) => (
				<td key={`${key}-${id}-name`}>
					{
						<img
							src={`${
								role === 'admin'
									? STATIC_ICONS.BLUE_ADMIN_KEY
									: STATIC_ICONS.WHITE_USER_KEY
							}`}
							alt="key"
							className="key-icon"
						/>
					}
					{<span className="ml-4">{role}</span>}
				</td>
			),
		},
		{
			stringId: 'name',
			label: 'Name',
			key: 'name',
			renderCell: (row, key, index, isExpandable, isExpanded) => (
				<td key={`${key}-${row.id}-name`}>
					{row.name}
					{
						<span className="ml-2">
							{isExpanded ? <CaretUpOutlined /> : <CaretDownOutlined />}
						</span>
					}
				</td>
			),
		},
		{
			stringId: 'created',
			label: 'Date generated',
			key: 'created',
			renderCell: ({ id, created }, key) => (
				<td key={`${key}-${id}-name`}>{getFormatTimestamp(created)}</td>
			),
		},
		{
			stringId: 'revoked',
			label: 'Revoke',
			key: 'revoked',
			renderCell: (row, key) => (
				<td
					onClick={() => handleEditData({ type: 'revoke', data: row })}
					key={`${key}-${row.id}-name`}
					className="underline-text"
				>
					{row.revoked ? 'Revoked' : 'REVOKE'}
				</td>
			),
		},
	];
};
