import React from 'react';
import { ActionNotification, IconTitle } from '../../../components';
import DumbField from '../../../components/Form/FormFields/DumbField';
import { generateWalletActionsText, formatToCurrency } from '../../../utils/currency';
import { ICONS, DEFAULT_COIN_DATA } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

export const renderDumbField = (data) => <DumbField {...data} />;

export const renderBankInformation = (
	{ bank_name, account_number, account_owner },
	fullWidth = false
) => {
	const allowCopy = true;
	const fields = [
		{
			label:
				STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_LABEL"],
			value: bank_name,
			key: 'bank_name',
			allowCopy,
			fullWidth
		},
		{
			label:
				STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_OWNER_LABEL"],
			value: account_owner,
			key: 'account_owner',
			allowCopy,
			fullWidth
		},
		{
			label:
				STRINGS["USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_LABEL"],
			value: account_number,
			key: 'account_number',
			allowCopy,
			fullWidth
		}
	];

	return (
		<div className="bank_account-data-wrapper">
			{fields.map((field) => renderDumbField(field))}
		</div>
	);
};

export const renderTitle = (symbol, type = 'withdraw', coins) => {
	const { withdrawText, depositText } = generateWalletActionsText(symbol, coins, true);
	return (
		<div className="title text-capitalize">
			{type === 'withdraw' ? withdrawText : depositText}
		</div>
	);
};

export const renderAvailableBalanceText = (currency, balance, coins) => {
	const { fullname, min, symbol = '' } = coins[currency] || DEFAULT_COIN_DATA;
	const shortName = symbol ? symbol.toUpperCase() : '';
	const available = formatToCurrency(balance[`${currency}_available`], min);

	return (
		<div className="text">
			<p>
				{STRINGS.formatString(
					STRINGS["AVAILABLE_BALANCE_TEXT"],
					fullname,
					available,
					shortName
				)}
			</p>
		</div>
	);
};

export const renderNeedHelpAction = (openContactForm, links = {}) => (
	<ActionNotification
		stringId="NEED_HELP_TEXT"
		text={STRINGS["NEED_HELP_TEXT"]}
		status="information"
		iconPath={ICONS.BLUE_QUESTION}
		onClick={() => openContactForm({ helpdesk: links.helpdesk })}
		className="need-help"
		useSvg={true}
	/>
);

export const renderInformation = (
	symbol,
	balance,
	openContactForm,
	generateBaseInformation,
	coins,
	type = 'withdraw',
	links = {}
) => {
	return (
		<div className="information_block">
			<div className="information_block-text_wrapper">
				{renderTitle(symbol, type, coins)}
				{renderAvailableBalanceText(symbol, balance, coins)}
			</div>
			{openContactForm && renderNeedHelpAction(openContactForm, links)}
		</div>
	);
};

export const renderTitleSection = (symbol, type, icon, coins) => {
	const { withdrawText, depositText } = generateWalletActionsText(symbol, coins);
	const text = type === 'withdraw' ? withdrawText : depositText;

	return <IconTitle text={text} iconPath={icon} textType="title" useSvg={true} />;
};
