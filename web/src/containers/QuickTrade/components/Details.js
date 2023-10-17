import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _get from 'lodash/get';
import { Coin, EditWrapper, PriceChange } from 'components';
import STRINGS from 'config/localizedStrings';
import SparkLine from 'containers/TradeTabs/components/SparkLine';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const DEFAULT_CHART_OPTIONS = {
	tooltip: {
		enabled: false,
	},
	title: {
		text: null,
	},
	legend: {
		enabled: false,
	},
	chart: {
		styledMode: true,
	},
	xAxis: {
		type: 'linear',
		allowDecimals: false,
		visible: false,
	},
	yAxis: {
		visible: false,
	},
	plotOptions: {
		series: {
			className: 'main-color',
			negativeColor: true,
			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: false,
					},
				},
			},
		},
	},
	pane: {
		size: '100%',
	},
	
};

const Details = ({ coins, constants, market, router, lineChartData }) => {
	const { icon_id, key, fullMarketName, ticker = {} } = market;
	const [pairBase, pair_2] = market.key.split('-');

	const handleClick = (pair) => {
		if (pair && router && _get(constants, 'features.pro_trade')) {
			router.push(`/trade/${pair}`);
		}
	};
	console.log('lineChartData', lineChartData);

	return (
		<div className="trade-details-wrapper">
			<div className="trade-details-content">
				<div className="d-flex pb-30">
					<Coin iconId={icon_id} type="CS11" />
					<div className="pl-2">
						<div className="pairs pointer" onClick={() => handleClick(key)}>
							{coins[pairBase] && coins[pairBase].display_name}/
							{coins[pair_2] && coins[pair_2].display_name}
						</div>
						<div className="fullname">{fullMarketName}</div>
					</div>
				</div>
				<div className="d-flex">
					<div>
						<div className="sub-title caps">
							<EditWrapper stringId="MARKETS_TABLE.LAST_PRICE">
								{STRINGS['MARKETS_TABLE.LAST_PRICE']}
							</EditWrapper>
						</div>
						<div className="d-flex">
							<div className="f-size-22 pr-2">{ticker.last}</div>
							<div className="fullname white-txt">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
					<div className="pl-6 trade_tabs-container">
						<div className="sub-title caps">
							<EditWrapper stringId="QUICK_TRADE_COMPONENT.CHANGE_TEXT_7D">
								{STRINGS['QUICK_TRADE_COMPONENT.CHANGE_TEXT_7D']}
							</EditWrapper>
						</div>
						<PriceChange market={market} key={key} large />
					</div>
				</div>
				<div className="chart w-100">
					<div className="fade-area" />
					<HighchartsReact
						highcharts={Highcharts}
						options={{
							...DEFAULT_CHART_OPTIONS,
							series: [{
								name: 'price',
								data: lineChartData.price,
								pointStart: 0
							}
						]}}
						containerProps={{
							style: { height: '100%', width: '100%' },
						}}
					/>
				</div>
				<div className="d-flex pb-35">
					<div>
						<div className="sub-title">
							<EditWrapper stringId="QUICK_TRADE_COMPONENT.HIGH_7D">
								{STRINGS['QUICK_TRADE_COMPONENT.HIGH_7D']}
							</EditWrapper>
						</div>
						<div className="d-flex">
							<div className="f-size-16 pr-2">{ticker.high}</div>
							<div className="fullname">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
					<div className="pl-6">
						<div className="sub-title">
							<EditWrapper stringId="QUICK_TRADE_COMPONENT.LOW_7D">
								{STRINGS['QUICK_TRADE_COMPONENT.LOW_7D']}
							</EditWrapper>
						</div>
						<div className="d-flex">
							<div className="f-size-16 pr-2">{ticker.low}</div>
							<div className="fullname">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
				</div>
				<div className="d-flex pb-35">
					<div>
						<div className="sub-title">
							<EditWrapper stringId="QUICK_TRADE_COMPONENT.BEST_BID">
								{STRINGS['QUICK_TRADE_COMPONENT.BEST_BID']}
							</EditWrapper>
						</div>
						<div className="d-flex">
							<div className="f-size-16 pr-2">{ticker.open}</div>
							<div className="fullname">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
					<div className="pl-6">
						<div className="sub-title">
							<EditWrapper stringId="QUICK_TRADE_COMPONENT.BEST_ASK">
								{STRINGS['QUICK_TRADE_COMPONENT.BEST_ASK']}
							</EditWrapper>
						</div>
						<div className="d-flex">
							<div className="f-size-16 pr-2">{ticker.close}</div>
							<div className="fullname">
								{coins[pair_2] && coins[pair_2].display_name}
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="sub-title caps">
						<EditWrapper stringId="SUMMARY.VOLUME_7D">
							{STRINGS['SUMMARY.VOLUME_7D']}
						</EditWrapper>
					</div>
					<div className="d-flex">
						<div className="f-size-16 pr-2">{ticker.volume}</div>
						<div className="fullname">
							{coins[pairBase] && coins[pairBase].display_name}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	pairs: store.app.pairs,
	coins: store.app.coins,
	constants: store.app.constants,
});

export default connect(mapStateToProps)(withRouter(Details));
