import React from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { EditWrapper } from 'components';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';

const TradeBlock = ({
	children,
	action,
	stringId,
	title,
	overflowY = false,
	setRef,
	alignChildY = false,
	className = '',
	pairData = {},
	pair,
	isLoggedIn,
	activeTheme,
	tailHead = '',
	icons: ICONS,
}) => {
	const pairs = pair ? pair.split('-').map((curr) => curr.toUpperCase()) : [];
	const { pair_base } = pairData;
	let ICON_PATH = pair_base ? ICONS[`${pair_base.toUpperCase()}_ICON`] : ``;
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
				<div className="d-flex justify-content-between">
					<div className="d-flex">
						{pairs.length ? (
							<Image
								icon={ICON_PATH ? ICON_PATH : ICONS['DEFAULT_ICON']}
								wrapperClassName="trade_block-icon"
							/>
						) : null}
						<EditWrapper stringId={stringId}>
							<div className="trade_block-title-items">{title}</div>
						</EditWrapper>
					</div>
					{tailHead ? (
						<div className={'trade_block-title-currency'}>{tailHead}</div>
					) : (
						<div
							className={
								pairs.length
									? `trade_block-title-currency-${pairs[0].toLowerCase()}`
									: 'trade_block-title-currency'
							}
						>
							{pairs.length ? `${pairs[0]}/${pairs[1]}` : ''}
						</div>
					)}
				</div>
				{action}
			</div>
			<div
				ref={setRef}
				className={classnames(
					'trade_block-content',
					isLoggedIn ? 'd-flex' : '',
					{
						'overflow-y': overflowY,
						'flex-column': alignChildY,
					}
				)}
			>
				{children}
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
});

export default connect(mapStateToProps)(withConfig(TradeBlock));
