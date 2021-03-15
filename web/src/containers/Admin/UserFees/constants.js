import React from 'react';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import STRINGS from '../../../config/localizedStrings';

export const BTC_COLUMNS_FEES = [
	{
		title: 'Verification Level',
		dataIndex: 'verification_level',
		key: 'verification_level',
	},
	{
		title: 'btc-eur maker_fee',
		dataIndex: 'btc-eur_maker_fee',
		key: 'btc-eur_maker_fee',
	},
	{
		title: 'btc-eur taker_fee',
		dataIndex: 'btc-eur_taker_fee',
		key: 'btc-eur_taker_fee',
	},
];

export const ETH_COLUMNS_FEES = [
	{
		title: 'Verification Level',
		dataIndex: 'verification_level',
		key: 'verification_level',
	},
	{
		title: 'btc-eur maker_fee',
		dataIndex: 'btc-eur_maker_fee',
		key: 'btc-eur_maker_fee',
	},
	{
		title: 'btc-eur taker_fee',
		dataIndex: 'btc-eur_taker_fee',
		key: 'btc-eur_taker_fee',
	},
];

export const getPairsColumns = (handleClick) => [
	{
		title: 'name',
		dataIndex: 'name',
		key: 'name',
		render: (v, data) => <div>{v}</div>,
	},
	{
		title: 'pair_base',
		dataIndex: 'pair_base',
		key: 'pair_base',
		render: (v, data) => <div>{v}</div>,
	},
	{
		title: 'pair_2',
		dataIndex: 'pair_2',
		key: 'pair_2',
		render: (v, data) => <div>{v}</div>,
	},
	{
		title: 'active',
		dataIndex: 'active',
		key: 'active',
		render: (v, data) => (
			<div className="d-flex">
				<div>{v ? 'active' : 'inactive'}</div>
				<div className="pointer" onClick={() => handleClick(v, data, 'active')}>
					<ReactSVG src={STATIC_ICONS.EDIT_ICON} className="edit_icon mx-2" />
				</div>
			</div>
		),
	},
	{
		title: 'increment_price',
		dataIndex: 'increment_price',
		key: 'increment_price',
		render: (v, data) => (
			<div className="d-flex">
				<div>{v}</div>
				<div
					className="pointer"
					onClick={() => handleClick(v, data, 'increment_price')}
				>
					<ReactSVG src={STATIC_ICONS.EDIT_ICON} className="edit_icon mx-2" />
				</div>
			</div>
		),
	},
	{
		title: 'increment_size',
		dataIndex: 'increment_size',
		key: 'increment_size',
		render: (v, data) => (
			<div className="d-flex">
				<div>{v}</div>
				<div
					className="pointer"
					onClick={() => handleClick(v, data, 'increment_size')}
				>
					<ReactSVG src={STATIC_ICONS.EDIT_ICON} className="edit_icon mx-2" />
				</div>
			</div>
		),
	},
	{
		title: 'max_price',
		dataIndex: 'max_price',
		key: 'max_price',
		render: (v, data) => (
			<div className="d-flex">
				<div>{v}</div>
				<div
					className="pointer"
					onClick={() => handleClick(v, data, 'max_price')}
				>
					<ReactSVG src={STATIC_ICONS.EDIT_ICON} className="edit_icon mx-2" />
				</div>
			</div>
		),
	},
	{
		title: 'max_size',
		dataIndex: 'max_size',
		key: 'max_size',
		render: (v, data) => (
			<div className="d-flex">
				<div>{v}</div>
				<div
					className="pointer"
					onClick={() => handleClick(v, data, 'max_size')}
				>
					<ReactSVG src={STATIC_ICONS.EDIT_ICON} className="edit_icon mx-2" />
				</div>
			</div>
		),
	},
	{
		title: 'min_price',
		dataIndex: 'min_price',
		key: 'min_price',
		render: (v, data) => (
			<div className="d-flex">
				<div>{v}</div>
				<div
					className="pointer"
					onClick={() => handleClick(v, data, 'min_price')}
				>
					<ReactSVG src={STATIC_ICONS.EDIT_ICON} className="edit_icon mx-2" />
				</div>
			</div>
		),
	},
	{
		title: 'min_size',
		dataIndex: 'min_size',
		key: 'min_size',
		render: (v, data) => (
			<div className="d-flex">
				<div>{v}</div>
				<div
					className="pointer"
					onClick={() => handleClick(v, data, 'min_size')}
				>
					<ReactSVG src={STATIC_ICONS.EDIT_ICON} className="edit_icon mx-2" />
				</div>
			</div>
		),
	},
	{
		title: 'maker_fees',
		dataIndex: 'maker_fees',
		key: 'maker_fees',
		render: (v, data) => (
			<div className="d-flex">
				<div
					className="blue-link pointer"
					onClick={() => handleClick(v, data, 'maker_fees')}
				>
					{STRINGS['VIEW']}
				</div>
			</div>
		),
	},
	{
		title: 'taker_fees',
		dataIndex: 'taker_fees',
		key: 'taker_fees',
		render: (v, data) => (
			<div className="d-flex">
				<div
					className="blue-link pointer"
					onClick={() => handleClick(v, data, 'taker_fees')}
				>
					{STRINGS['VIEW']}
				</div>
			</div>
		),
	},
];

const getMakerTakerFields = (userTier, key) => {
	const userFields = {};
	userTier.forEach((level) => {
		userFields[level] = {
			[`${key}_${level}`]: {
				type: 'number',
				label: '',
			},
		};
	});
	return userFields;
};

export const getPairsFormFields = (constants = {}) => {
	const userLevels = [];
	const user_level_number = constants.user_level_number
		? parseInt(constants.user_level_number)
		: 4;
	for (var i = 1; i <= user_level_number; i++) {
		userLevels.push(i);
	}
	return {
		name: {
			name: {
				type: 'text',
				label: 'name',
			},
		},
		pair_base: {
			pair_base: {
				type: 'text',
				label: 'pair_base',
			},
		},
		pair_2: {
			pair_2: {
				type: 'text',
				label: 'pair_2',
			},
		},
		active: {
			active: {
				type: 'select',
				label: 'active',
				options: [
					{ label: 'active', value: 'true' },
					{ label: 'deactive', value: 'false' },
				],
			},
		},
		increment_price: {
			increment_price: {
				type: 'number',
				label: 'Increment price',
			},
		},
		increment_size: {
			increment_size: {
				type: 'number',
				label: 'Increment size',
			},
		},
		max_price: {
			max_price: {
				type: 'number',
				label: 'Max price',
			},
		},
		max_size: {
			max_size: {
				type: 'number',
				label: 'Max size',
			},
		},
		min_price: {
			min_price: {
				type: 'number',
				label: 'Min price',
			},
		},
		min_size: {
			min_size: {
				type: 'number',
				label: 'Min size',
			},
		},
		increment_unit: {
			increment_unit: {
				type: 'number',
				label: 'increment unit',
			},
		},
		maker_fees: getMakerTakerFields(userLevels, 'maker_fees'),
		taker_fees: getMakerTakerFields(userLevels, 'taker_fees'),
	};
};
