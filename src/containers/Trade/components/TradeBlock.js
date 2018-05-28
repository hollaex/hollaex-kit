import React from 'react';
import classnames from 'classnames';

const TradeBlock = ({
	children,
	title,
	overflowY = false,
	setRef,
	alignChildY = false,
	className = ''
}) => {
	return (
		<div
			className={classnames(
				'trade_block-wrapper',
				'd-flex',
				'flex-column',
				className,
				'apply_rtl'
			)}
		>
			<div className="trade_block-title">{title}</div>
			<div
				ref={setRef}
				className={classnames('trade_block-content', 'd-flex', {
					'overflow-y': overflowY,
					'flex-column': alignChildY
				})}
			>
				{children}
			</div>
		</div>
	);
};

export default TradeBlock;
