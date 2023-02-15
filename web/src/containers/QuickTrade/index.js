import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { browserHistory } from 'react-router';
import { QuickTradeLimitsSelector, BrokerLimitsSelector } from './utils';

import STRINGS from 'config/localizedStrings';

import { QuickTrade, Dialog, Loader, MobileBarBack, Button } from 'components';
import ReviewBlock from 'components/QuickTrade/ReviewBlock';
import { changeSymbol } from 'actions/orderbookAction';
import { getDecimals } from 'utils/utils';
import {
	changePair,
	setNotification,
	setSnackNotification,
} from 'actions/appActions';

import QuoteResult from './QuoteResult';
import withConfig from 'components/ConfigProvider/withConfig';
import { getSourceOptions } from 'containers/QuickTrade/components/utils';

const TEMP_AMOUNT = 0;

class QuickTradeContainer extends PureComponent {
	constructor(props) {
		super(props);
		const {
			pair,
			side,
			tickerClose,
			selectedSource,
			targetOptions,
			selectedTarget,
		} = this.calculateSideData();

		this.state = {
			pair,
			side,
			tickerClose,
			showQuickTradeModal: false,
			targetOptions,
			selectedSource,
			selectedTarget,
			targetAmount: undefined,
			sourceAmount: undefined,
			order: {
				fetching: false,
				error: false,
				data: {},
			},
			sourceError: '',
			targetError: '',
			page: 0,
			pageSize: 12,
			isSelectChange: false,
			isSourceChanged: false,
			isLoading: false,
			buyPrice: 0,
			sellPrice: 0,
			token: '',
		};

		this.goToPair(pair);
	}

	calculateSideData = () => {
		const {
			routeParams,
			tickers,
			pairs,
			router,
			broker,
			sourceOptions,
		} = this.props;

		const pairKeys = Object.keys(pairs);
		const flippedPair = this.flipPair(routeParams.pair);
		const brokerPairs = Object.fromEntries(
			broker.map((data) => [data.symbol, data])
		);

		let pair;
		let side;
		let tickerClose;
		let originalPair;
		if (brokerPairs[routeParams.pair] || pairs[routeParams.pair]) {
			originalPair = routeParams.pair;
			pair = routeParams.pair;
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else if (brokerPairs[flippedPair] || pairs[flippedPair]) {
			originalPair = routeParams.pair;
			pair = flippedPair;
			const { close } = tickers[pair] || {};
			side = 'sell';
			tickerClose = 1 / close;
		} else if (pairKeys.length) {
			originalPair = pairKeys[0];
			pair = pairKeys[0];
			const { close } = tickers[pair] || {};
			side = 'buy';
			tickerClose = close;
		} else {
			router.push('/summary');
		}

		const [, selectedSource = sourceOptions[0]] = originalPair.split('-');
		const targetOptions = this.getTargetOptions(selectedSource);
		const [selectedTarget = targetOptions[0]] = originalPair.split('-');

		return {
			pair,
			side,
			tickerClose,
			originalPair,
			selectedSource,
			targetOptions,
			selectedTarget,
		};
	};

	UNSAFE_componentWillMount() {
		const { isReady, router, routeParams } = this.props;
		this.changePair(routeParams.pair);
		if (!isReady) {
			router.push('/summary');
		}
	}

	componentDidMount() {
		const { constants, router, fetchingAuth, sourceOptions } = this.props;

		if (
			constants &&
			constants.features &&
			!constants.features.quick_trade &&
			!fetchingAuth
		) {
			router.push('/account');
		}

		if (sourceOptions && sourceOptions.length) {
			this.constructTarget();
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.pair !== this.props.routeParams.pair) {
			this.changePair(nextProps.routeParams.pair);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { sourceOptions } = this.props;

		if (
			!prevProps.sourceOptions.length &&
			JSON.stringify(prevProps.sourceOptions) !== JSON.stringify(sourceOptions)
		) {
			this.constructTarget();
		}

		if (
			JSON.stringify(prevProps.routeParams.pair) !==
				JSON.stringify(this.props.routeParams.pair) &&
			!this.state.isSelectChange
		) {
			const {
				pair,
				side,
				tickerClose,
				selectedSource,
				targetOptions,
				selectedTarget,
			} = this.calculateSideData();

			this.setState({
				pair,
				side,
				tickerClose,
				targetOptions,
				selectedSource,
				selectedTarget,
			});
		} else if (this.state.isSelectChange) {
			this.setState({
				isSelectChange: false,
			});
		}
	}

	changePair = (pair) => {
		this.setState({ pair });
		this.props.changePair(pair);
	};

	onOpenDialog = () => {
		this.setState({ showQuickTradeModal: true });
	};

	onCloseDialog = () => {
		this.setState({ showQuickTradeModal: false }, this.resetOrderData);
	};

	onReviewQuickTrade = () => {
		this.onOpenDialog();
	};

	onExecuteTrade = () => {
		window.alert('Execute Trade Man!');
	};

	onGoBack = () => {
		const { router } = this.props;
		const { pair } = this.state;

		router.push(`/trade/${pair}`);
	};

	flipPair = (pair) => {
		const pairArray = pair.split('-');
		return pairArray.reverse().join('-');
	};

	onSelectTarget = (selectedTarget) => {
		const { tickers, pairs, broker } = this.props;
		const { selectedSource } = this.state;
		const brokerPairs = broker.map((br) => br.symbol);

		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;

		let tickerClose;
		let side;
		let pair;
		if (pairs[pairName] || brokerPairs.includes(pairName)) {
			const { close } = tickers[pairName] || {};
			tickerClose = close;
			side = 'buy';
			pair = pairName;
		} else if (
			pairs[reversePairName] ||
			brokerPairs.includes(reversePairName)
		) {
			const { close } = tickers[reversePairName] || {};
			tickerClose = 1 / close;
			side = 'sell';
			pair = reversePairName;
		}

		this.setState({
			side,
			tickerClose,
			selectedTarget,
			isSelectChange: true,
		});
		if (pair) {
			this.goToPair(pair);
		}
	};

	onSelectSource = (selectedSource) => {
		const { pairs, broker } = this.props;
		let targetOptions = this.getTargetOptions(selectedSource);
		let selectedTarget = targetOptions && targetOptions[0];
		const pairName = `${selectedTarget}-${selectedSource}`;
		const reversePairName = `${selectedSource}-${selectedTarget}`;
		const brokerPairs = broker.map((br) => br.symbol);

		let pair;
		if (pairs[pairName] || brokerPairs.includes(pairName)) {
			pair = pairName;
		} else if (
			pairs[reversePairName] ||
			brokerPairs.includes(reversePairName)
		) {
			pair = reversePairName;
		}

		this.setState({
			selectedSource,
			selectedTarget,
		});

		if (pair) {
			this.goToPair(pair);
		}
	};

	constructTarget = () => {
		const {
			pair,
			side,
			tickerClose,
			targetOptions,
			selectedTarget,
		} = this.calculateSideData();

		this.setState({
			selectedTarget,
			targetOptions,
			side,
			tickerClose,
		});

		this.goToPair(pair);
	};

	getTargetOptions = (sourceKey) => {
		const { sourceOptions, pairs, broker } = this.props;
		let brokerPairs = {};
		broker.forEach((br) => {
			brokerPairs[br.symbol] = br;
		});

		return sourceOptions.filter(
			(key) =>
				pairs[`${key}-${sourceKey}`] ||
				pairs[`${sourceKey}-${key}`] ||
				brokerPairs[`${sourceKey}-${key}`] ||
				brokerPairs[`${key}-${sourceKey}`]
		);
	};

	goToPair = (pair) => {
		browserHistory.push(`/quick-trade/${pair}`);
	};

	resetOrderData = () => {
		this.setState({
			order: {
				fetching: false,
				error: false,
				data: {},
			},
		});
	};

	goToWallet = () => {
		const { router } = this.props;
		router.push('/wallet');
	};

	renderFooterBtn = () => {
		return (
			<Button
				label={STRINGS['CONFIRM_TEXT']}
				onClick={this.onExecuteTrade}
				className="ml-2"
			/>
		);
	};

	render() {
		const { pairData = {}, orderLimits, coins } = this.props;
		const {
			order,
			selectedTarget,
			selectedSource,
			showQuickTradeModal,
			pair,
			isLoading,
		} = this.state;

		const decimalPoint = getDecimals(pairData.increment_size);

		if (!pair || pair !== this.props.pair || !pairData) {
			return <Loader background={false} />;
		}

		return (
			<div className="h-100">
				<div id="quick-trade-header" />
				{isMobile && <MobileBarBack onBackClick={this.onGoBack} />}

				<div
					className={classnames(
						'd-flex',
						'f-1',
						'quote-container',
						'h-100',
						'justify-content-center',
						{
							'flex-column': isMobile,
						}
					)}
				>
					<QuickTrade
						onReviewQuickTrade={this.onReviewQuickTrade}
						symbol={pair}
						orderLimits={orderLimits[pair] || {}}
					/>
					<Dialog
						isOpen={showQuickTradeModal}
						label="quick-trade-modal"
						onCloseDialog={this.onCloseDialog}
						shouldCloseOnOverlayClick={false}
						showCloseText={false}
						style={{ 'z-index': 100 }}
					>
						{isLoading ? (
							<Loader relative={true} background={false} />
						) : showQuickTradeModal ? (
							!order.fetching && !order.completed ? (
								<div className="quote-review-wrapper">
									<div>
										<div className="mb-4">
											<div className="quote_header">
												{STRINGS['CONFIRM_TEXT']}
											</div>
											<div className="quote_content">
												{STRINGS['QUOTE_CONFIRMATION_MSG_TEXT_1']}
											</div>
											<div className="quote_content">
												{STRINGS['QUOTE_CONFIRMATION_MSG_TEXT_2']}
											</div>
										</div>
										<div>
											<ReviewBlock
												symbol={selectedSource}
												text={STRINGS['SPEND_AMOUNT']}
												amount={TEMP_AMOUNT}
												decimalPoint={decimalPoint}
											/>
											<ReviewBlock
												symbol={selectedTarget}
												text={STRINGS['ESTIMATE_RECEIVE_AMOUNT']}
												amount={TEMP_AMOUNT}
												decimalPoint={decimalPoint}
											/>
										</div>
										<footer className="d-flex pt-4">
											<Button
												label={STRINGS['CLOSE_TEXT']}
												onClick={this.onCloseDialog}
												className="mr-2"
											/>
											{this.renderFooterBtn()}
										</footer>
									</div>
								</div>
							) : (
								<QuoteResult
									coins={coins}
									pairData={pairData}
									data={order}
									onClose={this.onCloseDialog}
									onConfirm={this.goToWallet}
								/>
							)
						) : (
							<div />
						)}
					</Dialog>
				</div>
				<div id="quick-trade-footer" />
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair] || {};
	const sourceOptions = getSourceOptions(store.app.pairs, store.app.broker);
	const broker = store.app.broker || [];
	let flippedPair = pair.split('-');
	flippedPair = flippedPair.reverse().join('-');
	const qtlimits = !!broker.filter(
		(item) => item.symbol === pair || item.symbol === flippedPair
	)
		? BrokerLimitsSelector(store)
		: QuickTradeLimitsSelector(store);

	return {
		sourceOptions,
		pair,
		pairData,
		pairs: store.app.pairs,
		coins: store.app.coins,
		tickers: store.app.tickers,
		activeLanguage: store.app.language,
		orderLimits: qtlimits,
		settings: store.user.settings,
		constants: store.app.constants,
		fetchingAuth: store.auth.fetching,
		isReady: store.app.isReady,
		broker,
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
	changeSymbol: bindActionCreators(changeSymbol, dispatch),
	setNotification: bindActionCreators(setNotification, dispatch),
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(QuickTradeContainer));
