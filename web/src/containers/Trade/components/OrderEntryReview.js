import React, { Fragment } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import math from 'mathjs';
import { connect } from 'react-redux';
import { estimatedMarketPriceSelector } from 'containers/Trade/utils';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';

const ROW_CLASSNAMES = ['d-flex', 'justify-content-between'];

const renderAmount = (value, currency) =>
	`${value}${currency && ` ${currency}`}`;

const Review = ({
	orderPrice = 0,
	fees = 0,
	size = 0,
	currency,
	price,
	increment_price,
	formatToCurrency,
	type,
	onFeeStructureAndLimits,
	estimatedPrice,
	symbol,
	side,
}) => {
	// const orderAmountReceived = math.add(
	// 	math.fraction(orderPrice),
	// 	math.fraction(fees)
	// );
	const upToMarket = !math.smaller(orderPrice, 0);
	return (
		<div className="trade_order_entry-review d-flex flex-column">
			<div className={classnames(...ROW_CLASSNAMES, 'align-items-center')}>
				<div className="trade-order-price-text font-weight-bold important-text">
					<EditWrapper stringId="ESTIMATED_PRICE,ORDER_PRICE">
						<span
							className={
								side === 'buy' ? 'market-buy-side' : 'market-sell-side'
							}
						>
							{STRINGS[
								side === 'buy' ? 'SIDES_VALUES.buy' : 'SIDES_VALUES.sell'
							]?.toUpperCase()}
						</span>
						{type === 'market' ? (
							<span>{STRINGS['ESTIMATED_PRICE']}:</span>
						) : (
							<span>{STRINGS['ORDER_PRICE']}:</span>
						)}
					</EditWrapper>
				</div>
				<div className="text-price font-weight-bold">
					{type !== 'market' && (
						<Fragment>
							{upToMarket
								? price
									? renderAmount(
											formatToCurrency(price * size, increment_price),
											currency
									  )
									: 0
								: STRINGS['UP_TO_MARKET']}
						</Fragment>
					)}
					{type === 'market' && (
						<Fragment>
							{size
								? estimatedPrice
									? renderAmount(
											formatToCurrency(estimatedPrice, increment_price),
											currency
									  )
									: STRINGS['UP_TO_MARKET']
								: 0}
						</Fragment>
					)}
				</div>
			</div>
			<div className={classnames(...ROW_CLASSNAMES)}>
				<div>
					<EditWrapper stringId="FEES">{STRINGS['FEES']}</EditWrapper>:
				</div>
				<div
					className="text-price blue-link pointer caps"
					onClick={onFeeStructureAndLimits}
				>
					<EditWrapper stringId="VIEW_MY_FEES">
						{STRINGS['VIEW_MY_FEES']}
					</EditWrapper>
				</div>
			</div>
			<div className={classnames('d-flex', 'justify-content-end')}>
				<div />
				<div className="text-price blue-link pointer caps">
					<Link to={`/prices/coin/${symbol?.toLowerCase()}`}>
						<EditWrapper stringId="ABOUT_LINK">
							{STRINGS.formatString(STRINGS['ABOUT_LINK'], symbol)}
						</EditWrapper>
					</Link>
				</div>
				<span className="link-separator mx-2"></span>
				<div className="blue-link pointer caps">
					<Link to="/prices">
						<EditWrapper stringId="VIEW_ALL_PRICES_LINK">
							{STRINGS['VIEW_ALL_PRICES_LINK']}
						</EditWrapper>
					</Link>
				</div>
			</div>
		</div>
	);
};

Review.defaultProps = {
	orderPrice: 0,
	fees: 0,
	orderTotal: 0,
	currency: '',
	formatToCurrency: (value) => value,
};

const mapStateToProps = (store, ownProps) => {
	const [estimatedPrice] = estimatedMarketPriceSelector(store, ownProps);

	return {
		estimatedPrice,
	};
};

export default connect(mapStateToProps)(Review);
