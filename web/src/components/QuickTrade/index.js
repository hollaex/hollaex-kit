import React, { Component } from 'react';
import { Link } from 'react-router';
import {
	oneOfType,
	object,
	func,
	bool,
	string,
	array,
	number,
} from 'prop-types';
import classnames from 'classnames';
import Image from 'components/Image';
import { isMobile } from 'react-device-detect';
import { Transition } from 'react-transition-group';
import _get from 'lodash/get';

import withConfig from 'components/ConfigProvider/withConfig';
import { Button, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import InputGroup from './InputGroup';
import SparkLine from 'containers/TradeTabs/components/SparkLine';
import { getSparklines } from 'actions/chartAction';

class QuickTrade extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tickerDiff: 0,
			inProp: false,
			market: {},
			chartData: {},
			pairBase: '',
			pair_2: ''
		};
	}

	componentDidMount() {
		if (this.props.market) {
			const keyData = this.props.market.key.split('-');
			this.setState({
				market: this.props.market,
				pairBase: keyData[0],
				pair_2: keyData[1]
			});
		}

		getSparklines(Object.keys(this.props.pairs)).then((chartData) =>
			this.setState({ chartData })
		);
	}

	componentDidUpdate(prevProps) {
		if (this.props.market !== prevProps.market) {
			const keyData = this.props.market.key.split('-');
			this.setState({
				market: this.props.market,
				pairBase: keyData[0],
				pair_2: keyData[1]
			});
		}

		if (
			_get(prevProps, 'market.ticker.close') !==
			_get(this.props, 'market.ticker.close')
		) {
			const tickerDiff =
				_get(this.props, 'market.ticker.close') -
				_get(prevProps, 'market.ticker.close');
			this.setState((prevState) => ({
				...prevState,
				tickerDiff,
				inProp: !prevState.inProp,
			}));
		}

		if (this.props.pairs !== prevProps.pairs) {
			getSparklines(Object.keys(this.props.pairs)).then((chartData) =>
				this.setState({ chartData })
			);
		}
	}

	handleClick = (pair) => {
		const { router, constants } = this.props;
		if (pair && router && _get(constants, "features.pro_trade")) {
			router.push(`/trade/${pair}`);
		}
	};

	sourceTotalBalance = (value) => {
		if (value) {
			this.props.onChangeSourceAmount(value);
		}
	};

	targetTotalBalance = (value) => {
		if (value) {
			this.props.onChangeTargetAmount(value);
		}
	};
	render() {
		const {
			targetAmount,
			sourceAmount,
			onSelectSource,
			onSelectTarget,
			onChangeSourceAmount,
			onChangeTargetAmount,
			onReviewQuickTrade,
			disabled,
			targetOptions,
			sourceOptions,
			selectedSource,
			selectedTarget,
			forwardSourceError,
			forwardTargetError,
			orderLimits: { SIZE, PRICE },
			side,
			icons: ICONS,
			autoFocus = true,
			coins,
			user,
		} = this.props;
		const { inProp, market, tickerDiff, chartData, pairBase, pair_2 } = this.state;

		const {
			key,
			priceDifferencePercent,
			priceDifference,
			ticker = {},
			increment_size,
		} = market;

		let pairBase_fullName;
		let pair2_fullName;
		Object.keys(coins).forEach((data) => {
			if (coins[data].symbol === pairBase) {
				pairBase_fullName = coins[data].fullname;
			} else if (coins[data].symbol === pair_2) {
				pair2_fullName = coins[data].fullname;
			}
		});

		let userBalance;
		Object.keys(user).forEach((data) => {
			if (data === 'balance') {
				userBalance = user[data];
			}
		});
		const lineChartData = {
			...chartData[key],
			name: 'Line',
			type: 'line',
		};
		const selectedSourceBalance =
			userBalance[`${selectedSource.toLowerCase()}_balance`];
		const selectedTargetBalance =
			userBalance[`${selectedTarget.toLowerCase()}_balance`];
		return (
			<div className="quick_trade-container">
				<div
					className={classnames(
						'quick_trade-section_wrapper',
						'quick_trade-bottom-padded'
						// ...GROUP_CLASSES
					)}
				>
					<div className="d-flex content-center">
						<Image
							iconId="SIDEBAR_QUICK_TRADING_INACTIVE,QUICK_TRADE"
							icon={ICONS['SIDEBAR_QUICK_TRADING_INACTIVE']}
							wrapperClassName={
								isMobile ? 'quick_trade-tab-icon' : 'quick_trade-icon'
							}
						/>
					</div>
					<div
						className={classnames(
							'title text-capitalize',
							...FLEX_CENTER_CLASSES
						)}
					>
						{STRINGS['QUICK_TRADE_COMPONENT.TITLE']}
					</div>
					<div className={classnames('info-text', ...FLEX_CENTER_CLASSES)}>
						{STRINGS['QUICK_TRADE_COMPONENT.INFO']}
					</div>
				</div>
				<div className={classnames('quick_trade-wrapper', 'd-flex')}>
					{!isMobile ? (
						<div className="trade-details-wrapper">
							<div className="trade-details-content">
								<div className="d-flex pb-30">
									<Image
										iconId={`${pairBase.toUpperCase()}_ICON`}
										icon={
											ICONS[`${pairBase.toUpperCase()}_ICON`]
												? ICONS[`${pairBase.toUpperCase()}_ICON`]
												: ICONS['DEFAULT_ICON']
										}
										wrapperClassName="coins-icon"
										imageWrapperClassName="currency-ball-image-wrapper"
									/>
									<div className="pl-2">
										<div
											className="pairs pointer"
											onClick={() => this.handleClick(key)}
										>
											{pairBase.toUpperCase()}/
											{pair_2.toUpperCase()}
										</div>
										<div className="fullname">
											{pairBase_fullName}/{pair2_fullName}
										</div>
									</div>
								</div>
								<div className="d-flex">
									<div>
										<div className="sub-title">
											<EditWrapper stringId="MARKETS_TABLE.LAST_PRICE">
												{STRINGS['MARKETS_TABLE.LAST_PRICE'].toUpperCase()}
											</EditWrapper>
										</div>
										<div className="d-flex">
											<div className="f-size-22 pr-2">{ticker.last}</div>
											<div className="fullname white-txt">
												{selectedTarget.toUpperCase()}
											</div>
										</div>
									</div>
									<div className="pl-6 trade_tabs-container">
										<div className="sub-title">
											<EditWrapper stringId="QUICK_TRADE_COMPONENT.CHANGE_TEXT">
												{STRINGS[
													'QUICK_TRADE_COMPONENT.CHANGE_TEXT'
												].toUpperCase()}
											</EditWrapper>
										</div>
										<Transition in={inProp} timeout={1000}>
											{(state) => (
												<div className="d-flex f-size-22">
													<div
														className={classnames(
															'title-font',
															priceDifference < 0
																? 'price-diff-down trade-tab-price_diff_down'
																: 'price-diff-up trade-tab-price_diff_up',
															tickerDiff < 0
																? `glance-price-diff-down glance-trade-tab-price_diff_down ${state}`
																: `glance-price-diff-up glance-trade-tab-price_diff_up ${state}`
														)}
													>
														{priceDifferencePercent}
													</div>
												</div>
											)}
										</Transition>
									</div>
								</div>
								<div className="chart w-100">
									<div className="fade-area"></div>
									<SparkLine
										data={lineChartData || []}
										containerProps={{
											style: { height: '100%', width: '100%' },
										}}
									/>
								</div>
								<div className="d-flex pb-35">
									<div>
										<div className="sub-title">
											<EditWrapper stringId="QUICK_TRADE_COMPONENT.HIGH_24H">
												{STRINGS['QUICK_TRADE_COMPONENT.HIGH_24H']}
											</EditWrapper>
										</div>
										<div className="d-flex">
											<div className="f-size-16 pr-2">{ticker.high}</div>
											<div className="fullname">
												{selectedTarget.toUpperCase()}
											</div>
										</div>
									</div>
									<div className="pl-6">
										<div className="sub-title">
											<EditWrapper stringId="QUICK_TRADE_COMPONENT.LOW_24H">
												{STRINGS['QUICK_TRADE_COMPONENT.LOW_24H']}
											</EditWrapper>
										</div>
										<div className="d-flex">
											<div className="f-size-16 pr-2">{ticker.low}</div>
											<div className="fullname">
												{selectedTarget.toUpperCase()}
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
												{selectedTarget.toUpperCase()}
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
												{selectedTarget.toUpperCase()}
											</div>
										</div>
									</div>
								</div>
								<div>
									<div className="sub-title">
										<EditWrapper stringId="SUMMARY.VOLUME_24H">
											{STRINGS['SUMMARY.VOLUME_24H'].toUpperCase()}
										</EditWrapper>
									</div>
									<div className="d-flex">
										<div className="f-size-16 pr-2">{ticker.volume}</div>
										<div className="fullname">
											{selectedSource.toUpperCase()}
										</div>
									</div>
								</div>
							</div>
						</div>
					) : null}
					<div className="d-flex flex-column trade-section">
						<div className="inner-content">
							<div className="small-text">
								<EditWrapper stringId="QUICK_TRADE_COMPONENT.GO_TO_TEXT">
									<div className="mr-2">
										{STRINGS['QUICK_TRADE_COMPONENT.GO_TO_TEXT']}
									</div>
								</EditWrapper>{' '}
								<Link to="/wallet">
									<span>
										<div>{STRINGS['WALLET_TITLE']}</div>
									</span>
								</Link>
							</div>
							<div className="small-text">
								{selectedSource.toUpperCase()} {STRINGS['BALANCE_TEXT']}:{' '}
								<span
									className="ml-2 pointer"
									onClick={() => this.sourceTotalBalance(selectedSourceBalance)}
								>
									{selectedSourceBalance ? selectedSourceBalance : 0}
								</span>
							</div>
							<InputGroup
								name={STRINGS['CONVERT']}
								stringId={'CONVERT'}
								options={sourceOptions}
								inputValue={sourceAmount}
								selectValue={selectedSource}
								onSelect={onSelectSource}
								onInputChange={onChangeSourceAmount}
								forwardError={forwardSourceError}
								limits={side === 'buy' ? PRICE : SIZE}
								autoFocus={autoFocus}
								decimal={increment_size}
							/>
							<InputGroup
								name={STRINGS['TO']}
								stringId={'TO'}
								options={targetOptions}
								inputValue={targetAmount}
								selectValue={selectedTarget}
								onSelect={onSelectTarget}
								onInputChange={onChangeTargetAmount}
								forwardError={forwardTargetError}
								limits={side === 'buy' ? SIZE : PRICE}
								decimal={increment_size}
							/>
							<div className="small-text">
								{selectedTarget.toUpperCase()} {STRINGS['BALANCE_TEXT']}:{' '}
								<span
									className="ml-2 pointer"
									onClick={() => this.targetTotalBalance(selectedTargetBalance)}
								>
									{selectedTargetBalance ? selectedTargetBalance : 0}
								</span>
							</div>
							<div
								className={classnames(
									'quick_trade-section_wrapper',
									// 'quick_trade-bottom-padded',
									// 'my-5',
									'd-flex',
									'flex-column',
									'align-items-end',
									'btn-wrapper'
									// ...GROUP_CLASSES
								)}
							>
								<EditWrapper stringId={'QUICK_TRADE_COMPONENT.BUTTON'} />
								<Button
									label={STRINGS['QUICK_TRADE_COMPONENT.BUTTON']}
									onClick={onReviewQuickTrade}
									disabled={disabled}
									type="button"
									className={!isMobile ? "w-50" : "w-100"}
								/>
							</div>
							<div className="footer-text">
								<EditWrapper stringId="QUICK_TRADE_COMPONENT.FOOTER_TEXT">
									<div>{STRINGS['QUICK_TRADE_COMPONENT.FOOTER_TEXT']}</div>
								</EditWrapper>
								<div>
									<EditWrapper stringId="QUICK_TRADE_COMPONENT.FOOTER_TEXT_1">
										<div>{STRINGS['QUICK_TRADE_COMPONENT.FOOTER_TEXT_1']}</div>
									</EditWrapper>
									: {pairBase.toUpperCase()}/
									{pair_2.toUpperCase()}{' '}
									<span>{STRINGS['TYPES_VALUES.market']}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

QuickTrade.propTypes = {
	onReviewQuickTrade: func.isRequired,
	disabled: bool.isRequired,
	pairs: object.isRequired,
	coins: object.isRequired,
	orderLimits: object.isRequired,
	onSelectTarget: func.isRequired,
	onSelectSource: func.isRequired,
	targetOptions: array,
	sourceOptions: array,
	selectedSource: string,
	selectedTarget: string,
	targetAmount: oneOfType([number, string]),
	sourceAmount: oneOfType([number, string]),
	onChangeTargetAmount: func.isRequired,
	onChangeSourceAmount: func.isRequired,
};

QuickTrade.defaultProps = {
	targetOptions: [],
	sourceOptions: [],
	onReviewQuickTrade: () => {},
	disabled: false,
};

export default withConfig(QuickTrade);
