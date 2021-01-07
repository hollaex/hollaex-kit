import React, { Component } from 'react';
import classnames from 'classnames';
import { Transition } from 'react-transition-group';
import Image from 'components/Image';
import STRINGS from 'config/localizedStrings';
// import SparkLine from './SparkLine';
import { /*formatAverage,*/ formatToCurrency } from 'utils/currency';

class MarketCard extends Component {
	state = {
		inProp: false,
	};

	UNSAFE_componentWillUpdate(nextProp) {
		const {
			market: { priceDifference },
		} = this.props;
		if (priceDifference !== nextProp.market.priceDifference) {
			this.setState((prevState) => ({
				...prevState,
				inProp: !prevState.inProp,
			}));
		}
	}

	render() {
		const {
			icons: ICONS,
			market,
			/*chartData,*/ handleClick,
			index,
		} = this.props;
		const { inProp } = this.state;

		const {
			key,
			pair,
			symbol,
			pairTwo,
			fullname,
			ticker,
			increment_price,
			priceDifference,
			priceDifferencePercent,
		} = market;

		return (
			<div
				key={index}
				className={classnames('d-flex', 'trade-tab-list', 'pointer', {
					'active-tab': index === 0,
				})}
				onClick={() => handleClick(key)}
			>
				<div className="px-2">
					<Image
						iconId={
							ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
								? `${pair.pair_base.toUpperCase()}_ICON`
								: 'DEFAULT_ICON'
						}
						icon={
							ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
								? ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
								: ICONS['DEFAULT_ICON']
						}
						wrapperClassName="trade_tab-icons"
					/>
				</div>
				<div className="tabs-pair-details">
					<div className="trade_tab-pair-title">
						{symbol.toUpperCase()}/
						{pairTwo.symbol ? pairTwo.symbol.toUpperCase() : ''}
					</div>
					<div>
						{fullname}/{pairTwo.fullname}
					</div>
					<div>
						{STRINGS['PRICE']}:
						<span className="title-font ml-1">
							{formatToCurrency(ticker.close, increment_price)}
						</span>
					</div>
					<div className="d-flex">
						{/*<div*/}
						{/*className={*/}
						{/*priceDifference < 0*/}
						{/*? 'price-diff-down trade-tab-price_diff_down'*/}
						{/*: 'trade-tab-price_diff_up price-diff-up'*/}
						{/*}*/}
						{/*>*/}
						{/*{formatAverage(*/}
						{/*formatToCurrency(priceDifference, increment_price)*/}
						{/*)}*/}
						{/*</div>*/}
						<Transition in={inProp} timeout={1000}>
							{(state) => (
								<div className="d-flex">
									<div
										className={
											priceDifference < 0
												? `title-font price-diff-down trade-tab-price_diff_down ${state}`
												: `title-font price-diff-up trade-tab-price_diff_up ${state}`
										}
									>
										{priceDifferencePercent}
									</div>
								</div>
							)}
						</Transition>
					</div>
					<div>{`${STRINGS['CHART_TEXTS.v']}: ${
						ticker.volume
					} ${symbol.toUpperCase()}`}</div>
				</div>
			</div>
		);
	}
}

export default MarketCard;
