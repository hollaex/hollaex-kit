import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import Image from 'components/Image';
import { EditWrapper } from 'components';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';
import { bindActionCreators } from 'redux';
import { toggleTool } from 'actions/toolsAction';
import { formatCurrency } from 'utils/currency';
import strings from 'config/localizedStrings';
import { getChartHeaderValues } from 'actions/chartAction';

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
	icons: ICONS,
	tool,
	toggleTool,
	titleClassName = '',
	ticker,
}) => {
	const pairs = pair ? pair.split('-').map((curr) => curr.toUpperCase()) : [];
	const { icon_id } = pairData;
	const [stats, setStats] = useState({
		maxPrice: 0,
		lowPrice: 0,
		summary: 0,
	});

	useEffect(() => {
		getChartHeaderValues(pair).then((res) =>
			setStats({
				maxPrice: res.high,
				lowPrice: res.low,
				summary: res.volume,
			})
		);
	}, [pair, ticker]);

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
			<div
				className={classnames(
					'trade_block-title',
					'drag-handle',
					titleClassName
				)}
			>
				<div className="d-flex justify-content-between">
					<div className="d-flex">
						{pairs.length ? (
							<Image
								icon={ICONS[icon_id]}
								wrapperClassName="trade_block-icon"
							/>
						) : null}
						<div className="trade_block-title-items">
							<EditWrapper stringId={stringId}>{title}</EditWrapper>
						</div>
						{title.toLowerCase() === 'chart' && (
							<div className="d-flex flex-1">
								<div className="vertical-line-seperator" />
								<div className="trade-daily-value-container">
									<div className="ml-1">{strings['24H_MAX']}</div>
									<span className="trade_header_values">
										{formatCurrency(stats.maxPrice)}
										&nbsp;
										{pairs[1]}
									</span>
								</div>
								<div className="vertical-line-seperator" />
								<div className="trade-daily-value-container">
									<div className="trade_block-title-items ml-1">
										{strings['24H_MIN']}
									</div>
									<span className="trade_header_values">
										{formatCurrency(stats.lowPrice)}
										&nbsp;
										{pairs[1]}
									</span>
								</div>
								<div className="vertical-line-seperator" />
								<div className="trade-daily-value-container">
									<div className="trade_block-title-items ml-1">
										{strings['24H_VAL']}
									</div>
									<span className="trade_header_values">
										{stats.summary}
										&nbsp;
										{pairs[0]}
									</span>
								</div>
							</div>
						)}
					</div>
					{!!tool && (
						<div
							className="trade_block-title-currency pointer"
							onClick={() => toggleTool(tool)}
						>
							<CloseOutlined />
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
	pairTrades: store.orderbook.pairsTrades,
	activeTheme: store.app.theme,
	symbol: store.orderbook.symbol,
});

const mapDispatchToProps = (dispatch) => ({
	toggleTool: bindActionCreators(toggleTool, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(TradeBlock));
