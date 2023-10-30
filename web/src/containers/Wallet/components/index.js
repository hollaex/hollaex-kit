import React from 'react';
import math from 'mathjs';
import { ActionNotification, Help, IconTitle } from '../../../components';
import DumbField from '../../../components/Form/FormFields/DumbField';
import {
	generateWalletActionsText,
	formatToCurrency,
} from '../../../utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';
import { EditWrapper } from 'components';

export const renderDumbField = (data) => <DumbField {...data} />;

export const renderBankInformation = (
	{ bank_name, account_number, account_owner },
	fullWidth = false
) => {
	const allowCopy = true;
	const fields = [
		{
			label:
				STRINGS[
					'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_LABEL'
				],
			value: bank_name,
			key: 'bank_name',
			allowCopy,
			fullWidth,
		},
		{
			label:
				STRINGS[
					'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_OWNER_LABEL'
				],
			value: account_owner,
			key: 'account_owner',
			allowCopy,
			fullWidth,
		},
		{
			label:
				STRINGS[
					'USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_LABEL'
				],
			value: account_number,
			key: 'account_number',
			allowCopy,
			fullWidth,
		},
	];

	return (
		<div className="bank_account-data-wrapper">
			{fields.map((field) => renderDumbField(field))}
		</div>
	);
};

export const renderTitle = (symbol, type = 'withdraw', coins) => {
	const {
		withdrawText,
		depositText,
		stringId_withdraw,
		stringId_deposit,
	} = generateWalletActionsText(symbol, coins, true);

	return (
		<div className="title text-capitalize">
			<EditWrapper
				stringId={type === 'withdraw' ? stringId_withdraw : stringId_deposit}
			>
				{type === 'withdraw' ? withdrawText : depositText}
			</EditWrapper>
		</div>
	);
};

export const renderTotalBalance = (currency, balance, coins) => {
	const { min } = coins[currency] || DEFAULT_COIN_DATA;
	const balanceValue = balance[`${currency}_balance`] || 0;

	return (
		<div className="text">
			<EditWrapper stringId="CURRENCY_WALLET.TOTAL_BALANCE">
				{STRINGS.formatString(
					STRINGS['CURRENCY_WALLET.TOTAL_BALANCE'],
					formatToCurrency(balanceValue, min),
					currency.toUpperCase()
				)}
			</EditWrapper>
		</div>
	);
};

export const renderAvailableBalanceText = (currency, balance, coins) => {
	const { fullname, min, display_name } = coins[currency] || DEFAULT_COIN_DATA;
	const available = formatToCurrency(balance[`${currency}_available`], min);

	return (
		<div className="text">
			<EditWrapper
				stringId="AVAILABLE_BALANCE_TEXT"
				renderWrapper={(children) => <p className="mb-0">{children}</p>}
			>
				{STRINGS.formatString(
					STRINGS['AVAILABLE_BALANCE_TEXT'],
					fullname,
					available,
					display_name,
					<Help tip={STRINGS['CURRENCY_WALLET.TOOLTIP']} />
				)}
			</EditWrapper>
		</div>
	);
};

export const renderNeedHelpAction = (
	openContactForm,
	links = {},
	icon,
	iconId
) => (
	<ActionNotification
		stringId="NEED_HELP_TEXT"
		text={STRINGS['NEED_HELP_TEXT']}
		status="information"
		iconId={iconId}
		iconPath={icon}
		onClick={openContactForm}
		className="need-help"
	/>
);

export const renderInformation = (
	symbol = BASE_CURRENCY,
	balance,
	openContactForm,
	generateBaseInformation,
	coins,
	type = 'withdraw',
	links = {},
	helpIcon,
	iconId,
	orders
) => {
	const { fullname, min, display_name } = coins[symbol] || DEFAULT_COIN_DATA;
	const _available = balance[`${symbol}_available`] || 0;
	const _balance = balance[`${symbol}_balance`] || 0;
	const hold = math.subtract(
		math.fraction(_balance),
		math.fraction(_available)
	);

	const ordersOfSymbol = orders.filter((order) => {
		if (symbol === BASE_CURRENCY) {
			return order.side === 'buy';
		} else {
			return order.symbol === symbol && order.side === 'sell';
		}
	}).length;

	const TextHolders = ({ ordersOfSymbol, currencySymbol, hold, name }) => {
		const ordersText =
			ordersOfSymbol > 1
				? STRINGS['WALLET.ORDERS_PLURAL']
				: STRINGS['WALLET.ORDERS_SINGULAR'];
		const symbolComponent = <span className="text-uppercase">{name}</span>;
		return (
			<div className="text">
				{STRINGS.formatString(
					STRINGS['WALLET.HOLD_ORDERS'],
					ordersOfSymbol,
					ordersText,
					hold,
					currencySymbol,
					symbolComponent
				)}
			</div>
		);
	};

	return (
		<div className="information_block">
			<div className="information_block-text_wrapper">
				{renderTitle(symbol, type, coins)}
				{renderTotalBalance(symbol, balance, coins)}
				{renderAvailableBalanceText(symbol, balance, coins)}
				{ordersOfSymbol > 0 && (
					<TextHolders
						ordersOfSymbol={ordersOfSymbol}
						currencySymbol={display_name}
						hold={formatToCurrency(hold, min)}
						name={display_name || fullname}
					/>
				)}
			</div>
			{openContactForm &&
				renderNeedHelpAction(openContactForm, links, helpIcon, iconId)}
		</div>
	);
};

export const renderTitleSection = (symbol, type, icon, coins, iconId) => {
	const {
		withdrawText,
		depositText,
		stringId_withdraw,
		stringId_deposit,
	} = generateWalletActionsText(symbol, coins);

	const text = type === 'withdraw' ? withdrawText : depositText;
	const stringId = type === 'withdraw' ? stringId_withdraw : stringId_deposit;

	return (
		<IconTitle
			text={text}
			stringId={stringId}
			iconPath={coins[symbol].logo}
			iconId={iconId}
			textType="title"
		/>
	);
};
