import React from 'react';
import { Link } from 'react-router';

import { DEFAULT_COIN_DATA } from 'config/constants';
import { IconTitle, Button } from 'components';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { formatToCurrency } from 'utils/currency';

const RiskyOrder = ({ data, onConfirm, onClose, icons: ICONS }) => {
	const { display_name } =
		data.coins[data.pairData.pair_2] || DEFAULT_COIN_DATA;
	const { increment_price } = data.pairData;
	return (
		<div className="risky-trade-wrapper">
			<IconTitle
				stringId="USER_SETTINGS.RISKY_TRADE_DETECTED"
				text={STRINGS['USER_SETTINGS.RISKY_TRADE_DETECTED']}
				iconId="SETTING_RISK_MANAGE_WARNING_ICON"
				iconPath={ICONS['SETTING_RISK_MANAGE_WARNING_ICON']}
				textType="title"
				underline={true}
			/>
			<div className="mt-1 mb-2">
				{STRINGS.formatString(
					STRINGS['USER_SETTINGS.RISKY_WARNING_TEXT_1'],
					<span className="risky_managment_percentage">
						{STRINGS.formatString(
							STRINGS['USER_SETTINGS.RISKY_WARNING_TEXT_2'],
							`${data.order.order_portfolio_percentage}%`
						).join('')}
					</span>
				)}
				<EditWrapper stringId="USER_SETTINGS.RISKY_WARNING_TEXT_1,USER_SETTINGS.RISKY_WARNING_TEXT_2" />
			</div>
			<div className="mt-1 mb-2">
				<EditWrapper stringId="USER_SETTINGS.RISKY_WARNING_TEXT_3">
					{STRINGS['USER_SETTINGS.RISKY_WARNING_TEXT_3']}
				</EditWrapper>
			</div>
			<EditWrapper stringId="USER_SETTINGS.GO_TO_RISK_MANAGMENT">
				<Link
					to="/settings?tab=5"
					onClick={() => onClose()}
					className="blue-link"
				>
					{STRINGS['USER_SETTINGS.GO_TO_RISK_MANAGMENT']}
				</Link>
			</EditWrapper>
			<div className="mb-2 mt-2">
				<EditWrapper stringId="TYPE">
					{STRINGS['TYPE']}: {data.order.type} {data.order.side}
				</EditWrapper>
			</div>
			{data.order.price && data.order.size ? (
				<div className="mb-2">
					<EditWrapper stringId="AMOUNT">
						{STRINGS['AMOUNT']}:{' '}
						{formatToCurrency(
							data.order.price * data.order.size,
							increment_price
						)}{' '}
						{display_name}
					</EditWrapper>
				</div>
			) : null}
			<div className="d-flex mt-3">
				<Button
					stringId="BACK_TEXT"
					label={STRINGS['BACK_TEXT']}
					onClick={onClose}
				/>
				<div className="mx-2" />
				<Button
					stringId="PROCEED"
					label={STRINGS['PROCEED']}
					onClick={() => {
						onConfirm();
						onClose();
					}}
				/>
			</div>
		</div>
	);
};

export default withConfig(RiskyOrder);
