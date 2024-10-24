import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import { QuickTrade, Loader, MobileBarBack } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

class QuickTradeContainer extends PureComponent {
	UNSAFE_componentWillMount() {
		const { isReady, router } = this.props;
		if (!isReady) {
			router.push('/summary');
		}
	}

	componentDidMount() {
		const {
			constants: { features: { quick_trade = false } = {} } = {},
			router,
			fetchingAuth,
		} = this.props;

		if (quick_trade && !fetchingAuth) {
			router.push('/account');
		}
	}

	getFlippedPair = (pair) => {
		let flippedPair = pair.split('-');
		flippedPair.reverse();
		return flippedPair.join('-');
	};

	onGoBack = () => {
		const { router, pair, quicktrade } = this.props;
		const flippedPair = this.getFlippedPair(pair);
		const isQuickTrade = !!quicktrade?.filter(
			({ symbol, active, type }) =>
				!!active &&
				type !== 'pro' &&
				(symbol === pair || symbol === flippedPair)
		)?.length;
		if (pair && isQuickTrade) {
			return router.push('/wallet');
		} else if (pair && !isQuickTrade) {
			return router.push(`/trade/${pair}`);
		}
	};

	render() {
		const { pair } = this.props;

		if (!pair) {
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
					<QuickTrade />
				</div>
				<div id="quick-trade-footer" />
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		pair: store.app.pair,
		pairs: store.app.pairs,
		activeLanguage: store.app.language,
		constants: store.app.constants,
		fetchingAuth: store.auth.fetching,
		isReady: store.app.isReady,
		quicktrade: store.app.quicktrade,
	};
};

export default connect(mapStateToProps)(withConfig(QuickTradeContainer));
