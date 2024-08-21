import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Card, Switch } from 'antd';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	RightOutlined,
} from '@ant-design/icons';

import strings from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import icons from 'config/icons/dark';
import { Coin, EditWrapper, IconTitle } from 'components';
import { quicktradePairSelector } from 'containers/QuickTrade/components/utils';

const cardTypes = ['gainers', 'losers', 'newAssets'];
const cardTitles = [
	'DIGITAL_ASSETS.CARDS.GAINERS',
	'DIGITAL_ASSETS.CARDS.LOSERS',
	'DEPOSIT_STATUS.NEW',
];

const sortCoinsData = (coinsData) => ({
	gainers: coinsData
		.slice()
		.sort(
			(a, b) =>
				b.oneDayPriceDifferencePercenVal - a.oneDayPriceDifferencePercenVal
		)
		.slice(0, 3),
	losers: coinsData
		.slice()
		.sort(
			(a, b) =>
				a.oneDayPriceDifferencePercenVal - b.oneDayPriceDifferencePercenVal
		)
		.slice(0, 3),
	newAssets: coinsData
		.slice()
		.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
		.slice(0, 3),
});

const renderPercentage = (percentage, type) => (
	<span
		className={
			percentage &&
			(type === 'gainers' || percentage >= 0
				? 'gainer-percentage'
				: 'loser-percentage')
		}
	>
		{percentage &&
			(type === 'gainers' || percentage >= 0 ? (
				<CaretUpOutlined />
			) : (
				<CaretDownOutlined />
			))}
		{percentage ? (percentage >= 0 ? `+${percentage}` : percentage) : '0%'}
	</span>
);

const renderCards = (data, coins, type) =>
	data.map(
		({
			symbol,
			lastPrice,
			oneDayPriceDifferencePercent,
			oneDayPriceDifferencePercenVal,
		}) => (
			<div className="assets-wrapper mb-2" key={symbol}>
				<div className="asset-container">
					<Coin
						iconId={coins[symbol].icon_id}
						type={isMobile ? 'CS10' : 'CS8'}
					/>
					<div className="d-flex flex-column">
						<span className={isMobile && 'font-weight-bold'}>
							{coins[symbol].fullname}
						</span>
						<span className="asset-symbol">{symbol.toUpperCase()}</span>
					</div>
				</div>
				<div className="asset-container align-items-center">
					<div className="assets-value">
						<span className="gainer-price">
							{lastPrice ? `$${lastPrice}` : '-'}
						</span>
						{renderPercentage(
							type === 'newAssets'
								? oneDayPriceDifferencePercenVal
								: oneDayPriceDifferencePercent,
							type
						)}
					</div>
					<div className="right-arrow-icon">
						<RightOutlined />
					</div>
				</div>
			</div>
		)
	);

const AssetsCards = ({ coins, coinsData }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

	const sortedCoinsData = useMemo(() => sortCoinsData(coinsData), [coinsData]);

	const handleNavigation = (direction) => {
		setCurrentIndex(
			(prevIndex) =>
				(prevIndex + (direction === 'left' ? -1 : 1) + cardTypes.length) %
				cardTypes.length
		);
	};

	return (
		<>
			{!isMobile && (
				<div className="highlight-toggle-button">
					<div className="highlight-text">
						<EditWrapper stringId="DIGITAL_ASSETS.HIGHLIGHTS">
							{strings['DIGITAL_ASSETS.HIGHLIGHTS']}
						</EditWrapper>
					</div>
					<Switch
						size="small"
						checked={isVisible}
						onChange={() => setIsVisible(!isVisible)}
					/>
				</div>
			)}
			{isVisible &&
				(isMobile ? (
					<div className="d-flex flex-column align-items-center justify-content-center">
						<div className="d-flex align-items-center justify-content-center assets-card-container">
							<div
								className={`digital-assets-cards nav-area left-nav ${
									currentIndex === 0
										? 'new-asset-card'
										: currentIndex === 1
										? 'gainer-asset-card'
										: 'losers-asset-card'
								}`}
								onClick={() => handleNavigation('left')}
							/>
							<Card
								key={currentIndex}
								size="small"
								title={
									<IconTitle
										stringId={
											cardTypes[currentIndex] === 'gainers'
												? 'GAINER_CARD_ICON'
												: cardTypes[currentIndex] === 'losers'
												? 'LOSER_CARD_ICON'
												: 'NEW_ASSET_CARD_ICON'
										}
										text={strings[cardTitles[currentIndex]]}
										iconId="OTP_CODE"
										iconPath={
											icons[
												cardTypes[currentIndex] === 'gainers'
													? 'GAINER_CARD_ICON'
													: cardTypes[currentIndex] === 'losers'
													? 'LOSER_CARD_ICON'
													: 'NEW_ASSET_CARD_ICON'
											]
										}
										className="gainer-icon"
									/>
								}
								className={`digital-assets-cards ${
									cardTypes[currentIndex] === 'gainers'
										? 'gainer-asset-card'
										: cardTypes[currentIndex] === 'losers'
										? 'losers-asset-card'
										: 'new-asset-card'
								}`}
							>
								{renderCards(
									sortedCoinsData[cardTypes[currentIndex]],
									coins,
									cardTypes[currentIndex]
								)}
							</Card>
							<div
								className={`digital-assets-cards nav-area right-nav ${
									currentIndex === 0
										? 'losers-asset-card'
										: currentIndex === 1
										? 'new-asset-card'
										: 'gainer-asset-card'
								}`}
								onClick={() => handleNavigation('right')}
							/>
						</div>
						<div className="mt-5 mb-2 d-flex">
							{cardTypes.map((_, i) => (
								<div
									key={i}
									className={`custom-card-field ${
										currentIndex === i ? 'custom-card-field-active' : ''
									} ml-2`}
								/>
							))}
						</div>
					</div>
				) : (
					<div className="d-flex justify-content-around assets-card-container">
						{cardTypes.map((type, index) => (
							<Card
								onClick={() => setCurrentIndex(index)}
								key={index}
								size="small"
								title={
									<IconTitle
										stringId={
											type === 'gainers'
												? 'GAINER_CARD_ICON'
												: type === 'losers'
												? 'LOSER_CARD_ICON'
												: 'NEW_ASSET_CARD_ICON'
										}
										text={strings[cardTitles[index]]}
										iconId="OTP_CODE"
										iconPath={
											icons[
												type === 'gainers'
													? 'GAINER_CARD_ICON'
													: type === 'losers'
													? 'LOSER_CARD_ICON'
													: 'NEW_ASSET_CARD_ICON'
											]
										}
										className="gainer-icon"
									/>
								}
								className={`digital-assets-cards ${
									type === 'gainers'
										? 'gainer-asset-card'
										: type === 'losers'
										? 'losers-asset-card'
										: 'new-asset-card'
								}`}
							>
								{renderCards(sortedCoinsData[type], coins, type)}
							</Card>
						))}
					</div>
				))}
		</>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	quicktradePairs: quicktradePairSelector(state),
	coinsData: state.app.coinsData,
});

export default connect(mapStateToProps)(withConfig(AssetsCards));
