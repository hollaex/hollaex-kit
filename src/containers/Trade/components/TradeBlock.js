import React from 'react';
import classnames from 'classnames';

const TradeBlock = ({
	children,
	title,
	overflowY = false,
	setRef,
	alignChildY = false,
	alignChildTitle = false,
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
			<div className={classnames('trade_block-title', alignChildTitle && 'd-flex flex-row justify-flex-start')}>
				{title} {alignChildTitle && <div className="ml-2">{children[0]}</div>}
			</div>
			<div
				ref={setRef}
				className={classnames('trade_block-content', 'd-flex', {
					'overflow-y': overflowY,
					'flex-column': alignChildY
				})}
			>
				{!alignChildTitle ? children : children[1]}
			</div>
		</div>
	);
};

export default TradeBlock;
