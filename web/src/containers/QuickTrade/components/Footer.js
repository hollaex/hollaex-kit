import React from 'react';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { Link } from 'react-router';

const Footer = ({ brokerUsed, name, isNetwork, pair }) => {
	return (
		<div className="footer-text">
			<EditWrapper stringId="QUICK_TRADE_COMPONENT.FOOTER_TEXT">
				{STRINGS['QUICK_TRADE_COMPONENT.FOOTER_TEXT']}
			</EditWrapper>
			<div>
				<EditWrapper stringId="QUICK_TRADE_COMPONENT.FOOTER_TEXT_1">
					{STRINGS['QUICK_TRADE_COMPONENT.FOOTER_TEXT_1']}
				</EditWrapper>
				:{' '}
				{isNetwork ? (
					<span>
						<EditWrapper stringId="QUICK_TRADE_COMPONENT.SOURCE_TEXT">
							{STRINGS['QUICK_TRADE_COMPONENT.SOURCE_TEXT_NETWORK']}
						</EditWrapper>
					</span>
				) : !brokerUsed ? (
					<span>
						<Link to={`/trade/${pair}`}>
							<span className="blue-link pointer underline-text mr-2">
								{name}
							</span>
						</Link>
						<span>
							<EditWrapper stringId="TYPES_VALUES.market">
								{STRINGS['TYPES_VALUES.market']}
							</EditWrapper>
						</span>
					</span>
				) : (
					<span>
						<EditWrapper stringId="QUICK_TRADE_COMPONENT.SOURCE_TEXT">
							{STRINGS['QUICK_TRADE_COMPONENT.SOURCE_TEXT']}
						</EditWrapper>
					</span>
				)}
			</div>
			<div>
				<EditWrapper stringId="VIEW_PRICES">
					<Link to="/prices">
						<span className="blue-link text-decoration-underline pointer">
							{STRINGS['VIEW_PRICES']}
						</span>
					</Link>
				</EditWrapper>
			</div>
		</div>
	);
};

export default Footer;
