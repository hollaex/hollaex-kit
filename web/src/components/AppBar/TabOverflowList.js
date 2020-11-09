import React, { Component } from 'react';
import Image from 'components/Image';
import withConfig from 'components/ConfigProvider/withConfig';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../../config/constants';
import { donutFormatPercentage, formatToCurrency } from '../../utils/currency';

let tickClicked = false;

class TabOverflowList extends Component {
	componentDidMount() {
		document.addEventListener('click', this.onOutsideClick);
	}

	onOutsideClick = (event) => {
		const element = document.getElementById('tab-overflow-list');
		if (
			element &&
			event.target !== element &&
			!element.contains(event.target) &&
			!tickClicked
		) {
			this.props.closeOverflowMenu();
		}
		if (tickClicked) {
			tickClicked = false;
		}
	};

	onOverflow = (pair) => {
		tickClicked = true;
		this.props.handleOverflow(pair);
	};

	componentWillUnmount() {
		document.removeEventListener('click', this.onOutsideClick);
	}

	render() {
		const {
			selectedTabs,
			activePairTab,
			tickers,
			coins = {},
			icons: ICONS,
		} = this.props;
		return (
			<div id="tab-overflow-list" className="app-bar-add-tab-menu">
				<div className="app-bar-tab-overflow-content">
					{Object.keys(selectedTabs).map((pair, index) => {
						let menu = selectedTabs[pair] || {};
						let { symbol = '' } =
							coins[menu.pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
						let pairTwo =
							coins[menu.pair_2 || BASE_CURRENCY] || DEFAULT_COIN_DATA;
						const { increment_price } = menu;
						let ticker = tickers[pair] || {};
						const priceDifference =
							ticker.open === 0 ? 0 : (ticker.close || 0) - (ticker.open || 0);
						const tickerPercent =
							priceDifference === 0 || ticker.open === 0
								? 0
								: (priceDifference / ticker.open) * 100;
						let priceDifferencePercent = isNaN(tickerPercent)
							? donutFormatPercentage(0)
							: donutFormatPercentage(tickerPercent);
						return (
							<div
								key={index}
								className="app-bar-add-tab-content-list d-flex align-items-center"
								onClick={() => this.onOverflow(pair)}
							>
								{pair === activePairTab ? (
									<Image
										icon={ICONS.BLACK_CHECK}
										wrapperClassName="app-bar-tab-setting"
									/>
								) : (
									<div className="app-bar-tab-setting"> </div>
								)}
								<Image
									icon={
										ICONS[`${menu.pair_base.toUpperCase()}_ICON`]
											? ICONS[`${menu.pair_base.toUpperCase()}_ICON`]
											: ICONS.DEFAULT_ICON
									}
									wrapperClassName="app-bar-add-tab-icons"
								/>
								<div className="app_bar-pair-font">
									{symbol.toUpperCase()}/{pairTwo.symbol.toUpperCase()}:
								</div>
								<div className="title-font ml-1">
									{formatToCurrency(ticker.close, increment_price)}
								</div>
								<div
									className={
										priceDifference < 0
											? 'app-price-diff-down app-bar-price_diff_down'
											: 'app-bar-price_diff_up app-price-diff-up'
									}
								>
									{/* {formatAverage(formatToCurrency(priceDifference, increment_price))} */}
								</div>
								<div
									className={
										priceDifference < 0
											? 'title-font app-price-diff-down'
											: 'title-font app-price-diff-up'
									}
								>
									{priceDifferencePercent}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default withConfig(TabOverflowList);
