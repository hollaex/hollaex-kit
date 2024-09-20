import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Menu, Spin } from 'antd';
import BigNumber from 'bignumber.js';

import './_Volume.scss';
import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { EditWrapper, CheckTitle, Coin } from 'components';
import { fetchUserVolume } from './actions/volumeActions';
import { BASE_CURRENCY } from 'config/constants';
import { MoreOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { getAllAvailableMarkets, goToTrade } from 'containers/Wallet/utils';

const Volume = ({ coins, icons: ICONS, router, pairs, quicktrade }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [volumeData, setVolumeData] = useState([]);
	const [volumeNativeData, setVolumeNativeData] = useState([]);

	useEffect(() => {
		fetchVolumeData();
	}, []);

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

				<div className="volume-cards-wrapper">
					{Object.keys(volumeData).map((key) => {
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
												BASE_CURRENCY,
												volumeData[key].find((x) => x.total).total
											)}{' '}
											{BASE_CURRENCY?.toUpperCase()}
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
																			BASE_CURRENCY,
																			data[iconKey]
																		)}
																	</span>
																	<span>{BASE_CURRENCY?.toUpperCase()}</span>
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
					})}
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
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Volume));
