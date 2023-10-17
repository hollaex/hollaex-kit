import React, { useMemo } from 'react';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import Button from 'components/Button';

const QuoteExpiredBlock = ({ onRequoteClick, isExpired, icons: ICONS }) => {
	const handleClick = () => {
		onRequoteClick();
	};

	// Memoize the disabled prop to avoid unnecessary re-renders
	const disabled = useMemo(() => !isExpired, [isExpired]);

	return (
		<div className="quote-expired-block-wrapper d-flex flex-row">
			<div className="quote-expired-text">
				<p className="small-text">
					{STRINGS['QUICK_TRADE_QUOTE_EXPIRED_FIRST_LINE']}
				</p>
				<p className="small-text">
					{STRINGS['QUICK_TRADE_QUOTE_EXPIRED_SECOND_LINE']}
				</p>
			</div>

			<Button
				className="requote-button"
				label={STRINGS['QUICK_TRADE_QUOTE_EXPIRED_BUTTON']}
				onClick={handleClick}
				disabled={disabled}
				iconId="REFRESH_ICON"
				iconList={ICONS}
				position="right"
			/>
		</div>
	);
};

export default withConfig(QuoteExpiredBlock);
