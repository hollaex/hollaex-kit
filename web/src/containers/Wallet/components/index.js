import React from 'react';
import { ActionNotification, IconTitle } from '../../../components';
import DumbField from '../../../components/Form/FormFields/DumbField';
import {
	generateWalletActionsText,
	formatToCurrency,
} from '../../../utils/currency';
import { DEFAULT_COIN_DATA } from '../../../config/constants';
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

export const renderAvailableBalanceText = (currency, balance, coins) => {
	const { fullname, min, symbol = '' } = coins[currency] || DEFAULT_COIN_DATA;
	const shortName = symbol ? symbol.toUpperCase() : '';
	const available = formatToCurrency(balance[`${currency}_available`], min);

	return (
		<div className="text">
			<EditWrapper stringId="AVAILABLE_BALANCE_TEXT">
				<p>
					{STRINGS.formatString(
						STRINGS['AVAILABLE_BALANCE_TEXT'],
						fullname,
						available,
						shortName
					)}
				</p>
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
	symbol,
	balance,
	openContactForm,
	generateBaseInformation,
	coins,
	type = 'withdraw',
	links = {},
	helpIcon,
	iconId
) => {
	return (
		<div className="information_block">
			<div className="information_block-text_wrapper">
				{renderTitle(symbol, type, coins)}
				{renderAvailableBalanceText(symbol, balance, coins)}
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
			iconPath={icon}
			iconId={iconId}
			textType="title"
		/>
	);
};
