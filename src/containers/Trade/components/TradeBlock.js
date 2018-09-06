import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import { ICONS } from '../../../config/constants';
const TradeBlock = ({
	children,
	action,
	title,
	overflowY = false,
	setRef,
	alignChildY = false,
	className = '',
	pairData = {},
	pair, 
	activeTheme
}) => {
	const pairs = pair ? pair.split('-').map(curr => curr.toUpperCase()) : [];
	const { pair_base } = pairData;
	let ICON_PATH = pair_base ? ICONS[`${pair_base.toUpperCase()}_ICON${activeTheme === 'dark' ? '_DARK':''}`] : ``;
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
			<div className="trade_block-title">
				<div className='d-flex'>
					{pairs.length ? <ReactSVG path={ICON_PATH} wrapperClassName='trade_block-icon'/> : null}
					<div className="trade_block-title-items">{title}</div>
					<div className="trade_block-title-currency">{pairs.length ? `${pairs[0]}/${pairs[1]}` : ''}</div>
				</div>
				{action}
			</div>
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

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme
});

export default connect(mapStateToProps)(TradeBlock);
