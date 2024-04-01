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

	onGoBack = () => {
		const { router, pair } = this.props;

		router.push(`/trade/${pair}`);
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
	};
};

export default connect(mapStateToProps)(withConfig(QuickTradeContainer));
