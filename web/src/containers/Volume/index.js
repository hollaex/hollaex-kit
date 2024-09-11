import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';

import { EditWrapper, CheckTitle } from 'components';
import { Spin } from 'antd';
import { fetchUserVolume } from './actions/volumeActions';
import BigNumber from 'bignumber.js';
import STRINGS from 'config/localizedStrings';
import { BASE_CURRENCY } from 'config/constants';
import './_Volume.scss';
const Volume = ({ coins, icons: ICONS, router }) => {
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
			<div className="summary-container">
				<div style={{ display: 'flex', marginTop: 80, gap: 10 }}>
					<div>
						{' '}
						<CheckTitle icon={ICONS['TAB_SUMMARY']} />
					</div>
					<div style={{ fontSize: 25, position: 'relative', top: 22 }}>
						<EditWrapper stringId="VOLUME.VOLUME">
							{STRINGS['VOLUME.VOLUME']}
						</EditWrapper>
					</div>
				</div>
				<div style={{ borderBottom: '1px solid white' }}></div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: 10,
						marginBottom: 30,
					}}
				>
					<div
						onClick={() => {
							router.push('/transactions?tab=trades');
						}}
						style={{
							textDecoration: 'underline',
							color: '#4C51C7',
							cursor: 'pointer',
						}}
					>
						{`<`}
						<EditWrapper stringId="VOLUME.BACK">
							{STRINGS['VOLUME.BACK']}
						</EditWrapper>
					</div>
					<div style={{ display: 'flex', gap: 5 }}>
						<div
							onClick={() => {
								router.push('/trade');
							}}
							style={{
								textDecoration: 'underline',
								color: '#4C51C7',
								cursor: 'pointer',
							}}
						>
							<EditWrapper stringId="VOLUME.MARKETS">
								{STRINGS['VOLUME.MARKETS']}
							</EditWrapper>
						</div>
						<div style={{}}>|</div>
						<div
							onClick={() => {
								router.push('/quick-trade');
							}}
							style={{
								textDecoration: 'underline',
								color: '#4C51C7',
								cursor: 'pointer',
							}}
						>
							<EditWrapper stringId="VOLUME.CONVERT">
								{STRINGS['VOLUME.CONVERT']}
							</EditWrapper>
						</div>
						<div style={{}}>|</div>
						<div
							onClick={() => {
								router.push('/transactions?tab=trades');
							}}
							style={{
								textDecoration: 'underline',
								color: '#4C51C7',
								cursor: 'pointer',
							}}
						>
							<EditWrapper stringId="VOLUME.HISTORY">
								{STRINGS['VOLUME.HISTORY']}
							</EditWrapper>
						</div>
					</div>
				</div>
				<div>
					<EditWrapper stringId="VOLUME.TRADING_VOLUME">
						{STRINGS['VOLUME.TRADING_VOLUME']}
					</EditWrapper>
				</div>
				<div style={{ color: 'grey', fontSize: 12 }}>
					<EditWrapper stringId="VOLUME.VOLUME_DECS">
						{STRINGS['VOLUME.VOLUME_DECS']}
					</EditWrapper>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 30,
						gap: 15,
					}}
				>
					{Object.keys(volumeData).map((key) => {
						if (volumeData[key]?.length > 1) {
							return (
								<div
									className="volumeBottomCardColor"
									style={{ width: 300, borderTop: '1px solid white' }}
								>
									<div
										className="volumeTopCardColor"
										style={{ textAlign: 'center', padding: 60 }}
									>
										<div style={{ fontSize: 16 }}>{key}-DAY VOLUME:</div>
										<div style={{ fontSize: 25 }}>
											{formatVolumeCurrency(
												BASE_CURRENCY,
												volumeData[key].find((x) => x.total).total
											)}{' '}
											{BASE_CURRENCY?.toUpperCase()}
										</div>
										<div style={{ color: '#ccc' }}>(all assets)</div>
									</div>
									<div style={{ padding: 10, marginBottom: 10 }}>
										<div
											style={{
												textAlign: 'center',
												fontWeight: 'bold',
												fontSize: 16,
												marginBottom: 20,
											}}
										>
											TOP {key}D VOL. ASSET
										</div>

										{volumeData[key].map((data) => {
											const iconKey = Object.keys(data);
											if (!data.total) {
												return (
													<div>
														<div
															style={{
																display: 'flex',
																justifyContent: 'space-between',
															}}
														>
															<div style={{ display: 'flex', gap: 5 }}>
																<span>
																	<img
																		src={coins?.[iconKey]?.logo}
																		width={25}
																		height={25}
																		alt=""
																	/>
																</span>
																<div>
																	<div>{coins?.[iconKey].fullname}</div>
																	<div>
																		{coins?.[iconKey].symbol?.toUpperCase()}
																	</div>
																</div>
															</div>
															<div style={{ display: 'flex', gap: 5 }}>
																<div>
																	<div
																		style={{
																			display: 'flex',
																			justifyContent: 'flex-end',
																		}}
																	>
																		{formatVolumeCurrency(
																			BASE_CURRENCY,
																			data[iconKey]
																		)}{' '}
																		{BASE_CURRENCY?.toUpperCase()}
																	</div>
																	<div
																		style={{
																			display: 'flex',
																			justifyContent: 'flex-end',
																		}}
																	>
																		(
																		{formatVolumeCurrency(
																			iconKey[0],
																			volumeNativeData?.[key]?.[iconKey]
																		)}{' '}
																		{coins?.[iconKey].symbol?.toUpperCase()})
																	</div>
																</div>
																{/* <span>3</span> */}
															</div>
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
	quickTrade: state.app.quickTrade,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Volume));
