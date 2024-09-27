import React, { useState, useEffect } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Dropdown, Menu, Spin } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import BigNumber from 'bignumber.js';

import './_Volume.scss';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import icons from 'config/icons/dark';
import { EditWrapper, CheckTitle, Coin, Image } from 'components';
import { fetchUserVolume } from './actions/volumeActions';
import { getAllAvailableMarkets, goToTrade } from 'containers/Wallet/utils';
import { MarketsSelector } from 'containers/Trade/utils';

const Volume = ({
	coins,
	icons: ICONS,
	router,
	pairs,
	features,
	quicktrade,
	favourites,
	nativeCurrency,
	getMarkets,
	pair,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [volumeData, setVolumeData] = useState([]);
	const [volumeNativeData, setVolumeNativeData] = useState([]);
	const [isEmptyData, setIsEmptyData] = useState({
		oneDay: 0,
		sevenDays: 0,
		thirtyDays: 0,
		ninetyDays: 0,
	});

	useEffect(() => {
		fetchVolumeData();
	}, []);

	useEffect(() => {
		Object.keys(volumeData).map((key) =>
			setIsEmptyData((prev) => ({
				...prev,
				oneDay: key === '1' ? volumeData[key]?.length : 1,
				sevenDays: key === '7' ? volumeData[key]?.length : 1,
				thirtyDays: key === '30' ? volumeData[key]?.length : 1,
				ninetyDays: key === '90' ? volumeData[key]?.length : 1,
			}))
		);
	}, [volumeData]);

	const fetchVolumeData = async () => {
		try {
			setIsLoading(true);
			const data = await fetchUserVolume();
			setVolumeData(data.volume);
			setVolumeNativeData(data.volumeNative);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			return error;
		}
	};

	const formatVolumeCurrency = (currency, amount) => {
		const incrementUnit = coins[currency].increment_unit;

		const decimalPoint = new BigNumber(incrementUnit).dp();
		const sourceAmount = new BigNumber(amount)
			.decimalPlaces(decimalPoint)
			.toNumber();
		return sourceAmount;
	};

	const onHandleVolume = () => {
		if (features.pro_trade) {
			browserHistory.push(
				favourites && favourites.length
					? `/trade/${favourites[0]}`
					: `/trade/${getMarkets[0]?.key}`
			);
		} else if (features.quick_trade) {
			browserHistory.push(`/quick-trade/${pair}`);
		} else {
			browserHistory.push('/prices');
		}
	};

	const hasEmptyVolume =
		isEmptyData?.oneDay === 1 &&
		isEmptyData?.sevenDays === 1 &&
		isEmptyData?.thirtyDays === 1 &&
		isEmptyData?.ninetyDays === 1;

	return (
		<Spin spinning={isLoading}>
			<div className="summary-container volume-wrapper">
				<div className="title-wrapper">
					<div>
						{' '}
						<CheckTitle icon={ICONS['TAB_SUMMARY']} />
					</div>
					<div className="volume-label">
						<EditWrapper stringId="VOLUME.VOLUME">
							{STRINGS['VOLUME.VOLUME']}
						</EditWrapper>
					</div>
				</div>
				<div className="custom-line"></div>
				<div className="header-wrapper">
					<div
						onClick={() => {
							router.push('/transactions?tab=trades');
						}}
						className="blue-link pointer"
					>
						{`<`}
						<EditWrapper stringId="VOLUME.BACK">
							<span className="text-decoration-underline">
								{STRINGS['VOLUME.BACK']}
							</span>
						</EditWrapper>
					</div>
					<div className="link-label">
						<div
							onClick={() => {
								router.push('/trade');
							}}
							className="blue-link pointer"
						>
							<EditWrapper stringId="VOLUME.MARKETS">
								<span className="text-decoration-underline">
									{STRINGS['VOLUME.MARKETS']}
								</span>
							</EditWrapper>
						</div>
						<div>|</div>
						<div
							onClick={() => {
								router.push('/quick-trade');
							}}
							className="blue-link pointer"
						>
							<EditWrapper stringId="VOLUME.CONVERT">
								<span className="text-decoration-underline">
									{STRINGS['VOLUME.CONVERT']}
								</span>
							</EditWrapper>
						</div>
						<div>|</div>
						<div
							onClick={() => {
								router.push('/transactions?tab=trades');
							}}
							className="blue-link pointer"
						>
							<EditWrapper stringId="VOLUME.HISTORY">
								<span className="text-decoration-underline">
									{STRINGS['VOLUME.HISTORY']}
								</span>
							</EditWrapper>
						</div>
					</div>
				</div>
				<div className="fs-16">
					<EditWrapper stringId="VOLUME.TRADING_VOLUME">
						{STRINGS['VOLUME.TRADING_VOLUME']}
					</EditWrapper>
				</div>
				<div className="fs-14 secondary-text">
					<EditWrapper stringId="VOLUME.VOLUME_DECS">
						{STRINGS['VOLUME.VOLUME_DECS']}
					</EditWrapper>
				</div>
				<div
					className={
						hasEmptyVolume
							? 'volume-cards-wrapper volume-cards-empty-wrapper'
							: 'volume-cards-wrapper'
					}
				>
					{hasEmptyVolume ? (
						<div className="d-flex flex-direction-column secondary-text">
							<Image
								iconId="VOLUME_OPTION_ICON"
								icon={icons['VOLUME_OPTION_ICON']}
								wrapperClassName="secondary-text volume-option-icon"
							/>
							<div>
								<EditWrapper stringId="VOLUME.NO_DATA_DESC_1">
									{STRINGS['VOLUME.NO_DATA_DESC_1']}
								</EditWrapper>{' '}
								<EditWrapper stringId="VOLUME.NO_DATA_DESC_2">
									<span
										className="blue-link pointer text-decoration-underline"
										onClick={() => onHandleVolume()}
									>
										{STRINGS['VOLUME.NO_DATA_DESC_2']}
									</span>
								</EditWrapper>{' '}
								<EditWrapper stringId="VOLUME.NO_DATA_DESC_3">
									{STRINGS['VOLUME.NO_DATA_DESC_3']}
								</EditWrapper>
							</div>
						</div>
					) : (
						Object.keys(volumeData).map((key) => {
							if (volumeData[key]?.length > 1) {
								return (
									<div className="card-content-wrapper">
										<div
											className={
												key === '1'
													? 'custom-line-inactive-one'
													: key === '7'
													? 'custom-line-inactive-two'
													: key === '30'
													? 'custom-line-inactive-three'
													: 'custom-line-inactive-active'
											}
										></div>
										<div className="card-wrapper">
											<EditWrapper stringId="VOLUME.DAY_VOLUME">
												{key === '1' ? (
													<span className="card-day-volume-title fs-12 font-weight-bold">
														{STRINGS['VOLUME.HOUR_VOLUME']}
													</span>
												) : (
													<span className="card-day-volume-title fs-12 font-weight-bold">
														{key}-{STRINGS['VOLUME.DAY_VOLUME']}
													</span>
												)}
											</EditWrapper>
											<div className="fs-24 assets-price">
												{formatVolumeCurrency(
													nativeCurrency,
													volumeData[key].find((x) => x.total).total
												)}{' '}
												{nativeCurrency?.toUpperCase()}
											</div>
											<div className="secondary-text">
												(
												<EditWrapper stringId="VOLUME.ALL_ASSETS">
													{STRINGS['VOLUME.ALL_ASSETS']}
												</EditWrapper>
												)
											</div>
										</div>
										<div className="card-content fs-12">
											<div className="text-align-center font-weight-bold my-3">
												<EditWrapper>
													{STRINGS.formatString(
														STRINGS['VOLUME.TOP'],
														key,
														STRINGS['VOLUME.VOL_ASSET']
													)}
												</EditWrapper>
											</div>

											{volumeData[key].map((data) => {
												const iconKey = Object.keys(data);
												const market = getAllAvailableMarkets(
													iconKey[0],
													quicktrade
												);
												if (!data.total) {
													return (
														<div className="assets-content-wrapper mt-2">
															<div className="asset-name">
																<Coin
																	iconId={coins?.[iconKey]?.icon_id}
																	type={isMobile ? 'CS9' : 'CS7'}
																/>
																<div>
																	<div className="font-weight-bold">
																		{coins?.[iconKey].fullname}
																	</div>
																	<div className="secondary-text">
																		{coins?.[iconKey].symbol?.toUpperCase()}
																	</div>
																</div>
															</div>
															<div className="asset-price-container">
																<div>
																	<div className="currency-price font-weight-bold">
																		<span>
																			{formatVolumeCurrency(
																				nativeCurrency,
																				data[iconKey]
																			)}
																		</span>
																		<span>{nativeCurrency?.toUpperCase()}</span>
																	</div>
																	<div className="currency-price secondary-text">
																		<span>
																			(
																			{formatVolumeCurrency(
																				iconKey[0],
																				volumeNativeData?.[key]?.[iconKey]
																			)}
																		</span>
																		<span>
																			{coins?.[iconKey].symbol?.toUpperCase()})
																		</span>
																	</div>
																</div>
																<Dropdown
																	size="small"
																	overlayClassName="custom-dropdown-style"
																	overlay={
																		<Menu
																			onClick={({ key }) =>
																				goToTrade(key, quicktrade)
																			}
																		>
																			{market.map((market) => {
																				const { display_name, icon_id } =
																					pairs[market] ||
																					quicktrade.find(
																						({ symbol }) => symbol === market
																					) ||
																					{};
																				return (
																					<Menu.Item
																						className="caps"
																						key={market}
																					>
																						<div className="d-flex align-items-center">
																							<Coin
																								iconId={icon_id}
																								type={isMobile ? 'CS5' : 'CS2'}
																							/>
																							<div className="app_bar-pair-font">
																								{display_name}
																							</div>
																						</div>
																					</Menu.Item>
																				);
																			})}
																		</Menu>
																	}
																>
																	<MoreOutlined className="more-icon" />
																</Dropdown>
															</div>
														</div>
													);
												}
												return <></>;
											})}
										</div>
									</div>
								);
							}
							return <></>;
						})
					)}
				</div>
			</div>
		</Spin>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
	balances: state.user.balance,
	pricesInNative: state.asset.oraclePrices,
	quicktrade: state.app.quicktrade,
	pairs: state.app.pairs,
	nativeCurrency: state.app.constants.native_currency,
	features: state.app.features,
	favourites: state.app.favourites,
	getMarkets: MarketsSelector(state),
	pair: state.app.pair,
});

export default connect(mapStateToProps)(withConfig(Volume));
