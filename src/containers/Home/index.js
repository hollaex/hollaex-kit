import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import { bindActionCreators } from 'redux';

import { AppBar, Footer } from '../../components';

import { requestQuickTrade } from '../../actions/orderbookAction';
import { setLanguage } from '../../actions/appActions';
import { getClasesForLanguage } from '../../utils/string';

import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';

const INFORMATION_INDEX = 2;
const MIN_HEIGHT = 450;

class Home extends Component {
	state = {
		height: 0,
		style: {
			minHeight: MIN_HEIGHT
		}
	};

	setContainerRef = (el) => {
		if (el) {
			this.container = el;
			this.onResize();
		}
	};

	onResize = () => {
		if (this.container) {
			const height = this.container.clientHeight;
			this.setState({
				style: {
					minHeight: height
					// maxHeight: height,
				},
				height
			});
			// this.onClickScrollTo(0)();
		}
	};

	onClickScrollTo = (children = 0) => () => {
		if (this.container && typeof children === 'number') {
			const sections = this.container.children;
			if (children < sections.length) {
				sections[children].scrollIntoView({
					behavior: 'smooth'
				});
			}
		}
	};

	goTo = (path) => () => {
		this.props.router.push(path);
	};

	onReviewQuickTrade = () => {
		if (this.props.token) {
			this.goTo('quick-trade')();
		} else {
			this.goTo('login')();
		}
	};

	onChangeLanguage = (language) => () => {
		return this.props.changeLanguage(language);
	};

	render() {
		const {
			token,
			verifyToken,
			estimatedValue,
			symbol,
			quickTradeData,
			requestQuickTrade,
			activeLanguage
		} = this.props;
		const { style } = this.state;
		return (
			<div
				className={classnames(
					'app_container',
					'home_container',
					'app_background',
					getClasesForLanguage(activeLanguage)
				)}
			>
				<EventListener target="window" onResize={this.onResize} />
				<AppBar
					noBorders={true}
					isHome={true}
					token={token}
					verifyToken={verifyToken}
				/>
				<div
					className={classnames(
						'app_container-content',
						'home_container-content',
						'flex-column',
						'overflow-y'
					)}
					ref={this.setContainerRef}
				>
					<Section1
						style={{
							minHeight:
								style.minHeight > MIN_HEIGHT ? style.minHeight : MIN_HEIGHT
						}}
						onClickScrollTo={this.onClickScrollTo(INFORMATION_INDEX)}
						onClickLearnMore={this.onClickScrollTo(INFORMATION_INDEX)}
						onClickRegister={this.goTo('signup')}
						token={token}
					/>
					<Section2
						style={style}
						onReviewQuickTrade={this.onReviewQuickTrade}
						onRequestMarketValue={requestQuickTrade}
						symbol={symbol}
						quickTradeData={quickTradeData}
					/>
					<Section3
						style={style}
						onClickRegister={this.goTo('signup')}
						token={token}
					/>
					<Footer
						onChangeLanguage={this.onChangeLanguage}
						activeLanguage={activeLanguage}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	token: store.auth.token,
	verifyToken: store.auth.verifyToken,
	estimatedValue: 100,
	symbol: store.orderbook.symbol,
	quickTradeData: store.orderbook.quickTrade,
	activeLanguage: store.app.language
});

const mapDispatchToProps = (dispatch) => ({
	requestQuickTrade: bindActionCreators(requestQuickTrade, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
