import React from 'react';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

const Footer = ({ brokerUsed, name, isNetwork }) => {
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
						<span>{name} </span>
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
		</div>
	);
};

export default Footer;
