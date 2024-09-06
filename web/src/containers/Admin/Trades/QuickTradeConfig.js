import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, message, Switch, Input, Modal, Radio, Space } from 'antd';
import { updateQuickTradeConfig, updateConstants } from './actions';

import { setPricesAndAsset } from 'actions/assetActions';
import { getTickers, setBroker } from 'actions/appActions';
import { MarketsSelector } from 'containers/Trade/utils';
import { SettingOutlined, CloseOutlined } from '@ant-design/icons';

const quickTradeTypes = {
	network: 'HollaEx Network Swap',
	broker: 'OTC Desk',
	pro: 'Orderbook',
};

const QuickTradeTab = ({
	coins,
	pairs,
	quickTradeData,
	features,
	brokers,
	networkQuickTrades,
	handleTabChange,
}) => {
	const [isActive, setIsActive] = useState(false);
	const [displayConfigModal, setDisplayConfigModal] = useState(false);
	const [displayWarning, setDisplayWarning] = useState(false);
	const [quickTradeConfig, setQuickTradeConfig] = useState(quickTradeData);
	const [selectedConfig, setSelectedConfig] = useState();
	const [editMode, setEditMode] = useState(false);
	const [selectedType, setSelectedType] = useState();
	const [filter, setFilter] = useState();
	const [hasQuickTrade, setHasQuickTrade] = useState(features.quick_trade);

	const disableNetwork = networkQuickTrades?.find((e) => {
		const [base, quote] = e.symbol.split('-');
		return coins[base] && coins[quote] && e.symbol === selectedConfig?.symbol;
	});
	const disableBroker = brokers?.find(
		(broker) => broker.symbol === selectedConfig?.symbol
	);
	const disableOrderbook = pairs?.find(
		(pair) => pair.name === selectedConfig?.symbol
	);

	const handleCloseConfigModal = () => {
		setDisplayConfigModal(false);
		setSelectedConfig();
		setEditMode(false);
		setSelectedType(false);
	};
	return (
		<div className="otcDeskContainer">
			<div className="header-container">
				<div className="d-flex justify-content-center">
					<div>
						<div
							style={{
								width: 90,
								height: 24,
								backgroundColor: '#050596',
								color: 'white',
								textAlign: 'center',
							}}
						>
							SELL
						</div>
						<div
							style={{
								width: 90,
								height: 24,
								marginTop: 5,
								backgroundColor: 'white',
								textAlign: 'center',
								color: 'black',
							}}
						>
							BUY
						</div>
					</div>

					<div className="ml-4">
						<div className="main-subHeading">
							Quick Trade is a straight-forward buy and sell interface. Below
							are all the markets available to your users based on
						</div>
						<div className="main-subHeading">
							the active assets on your exchange. Each Quick Trade market can be
							configured to source prices and liquidity from either HollaEx's
							Network Swap, a
						</div>
						<div className="main-subHeading">
							matching Public Orderbook or your personal{' '}
							<span
								onClick={() => {
									handleTabChange('2');
								}}
								style={{ cursor: 'pointer', textDecoration: 'underline' }}
							>
								OTC Desk.
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="header-container" style={{ marginTop: 30 }}>
				<div className="d-flex justify-content-center">
					<div>
						<div className="main-Heading">Display Quick Trade page</div>
						<div className="main-subHeading">
							Allow your users to buy and sell through the Quick Trade
							interface.
						</div>
					</div>
				</div>
			</div>

			<div className="header-container" style={{ marginTop: 30 }}>
				<div className="d-flex justify-content-center">
					<div>
						<span
							className={
								!isActive ? 'switch-label' : 'switch-label label-inactive'
							}
						>
							Off
						</span>
						<Switch
							checked={hasQuickTrade}
							onClick={async (value) => {
								try {
									await updateConstants({
										kit: {
											features: {
												...features,
												quick_trade: value,
											},
										},
									});
									message.success('Changes saved.');
									setHasQuickTrade(value);
									setIsActive(value);
								} catch (err) {
									message.error(err?.data?.message);
								}
							}}
							className="mx-2"
						/>
						<span
							className={
								!isActive ? 'switch-label' : 'switch-label label-inactive'
							}
						>
							On
						</span>
					</div>
				</div>
			</div>

			<div className="header-container" style={{ marginTop: 30 }}>
				<div className="d-flex justify-content-center">
					<div>
						<div className="main-Heading">
							Active Quick Trade markets (
							{quickTradeConfig.filter((config) => config.active).length})
						</div>
					</div>
				</div>
			</div>

			<div className="header-container">
				<div className="d-flex justify-content-center">
					<div>
						<div className="main-subHeading">Search</div>
						<Input
							style={{ marginTop: 10 }}
							size="small"
							placeholder={'Search markets'}
							onChange={(e) => {
								setFilter(e.target.value);
							}}
						/>
					</div>
				</div>
				<div className="d-flex justify-content-center">
					<div className="ml-4" style={{ fontSize: 17 }}>
						[X] Disabled markets (
						{quickTradeConfig.filter((config) => !config.active).length})
					</div>
				</div>
			</div>

			<div style={{ marginTop: 50 }}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 10,
						paddingBottom: 20,
						flexWrap: 'wrap',
					}}
				>
					{quickTradeConfig
						?.filter((data) =>
							filter
								? data.symbol
										?.split('-')
										?.join('/')
										.toLowerCase()
										.includes(filter.toLowerCase())
								: true
						)
						.map((data) => {
							return (
								<div
									style={{
										height: 90,
										width: 200,
										textAlign: 'center',
										border: '1px solid #74B0E4',
										borderTop: '7px solid #74B0E4',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										color: '#b2b2b2',
										position: 'relative',
										opacity: hasQuickTrade && data.active ? 1 : 0.4,
										cursor: 'default',
									}}
								>
									{!data.active && <div>[X] DISABLED</div>}
									<div style={{ fontSize: 16, marginBottom: 3 }}>
										{data.symbol.split('-').join('/').toUpperCase()}
									</div>
									<div>{quickTradeTypes[data.type]}</div>

									<div
										onClick={() => {
											setSelectedConfig(data);
											setDisplayConfigModal(true);
											setEditMode(true);
											setSelectedType(data.type);
										}}
										style={{
											height: 30,
											width: 30,
											borderRadius: '100%',
											backgroundColor: '#288500',
											cursor: 'pointer',
											position: 'absolute',
											right: -5,
											bottom: -5,
											textAlign: 'center',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											color: 'white',
											fontSize: 17,
										}}
									>
										<SettingOutlined />
									</div>
								</div>
							);
						})}
				</div>
			</div>
			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined style={{ color: 'white' }} />}
				bodyStyle={{
					backgroundColor: '#27339D',
				}}
				visible={displayConfigModal}
				footer={null}
				onCancel={() => {
					handleCloseConfigModal();
				}}
			>
				<div
					style={{
						fontWeight: '600',
						color: 'white',
						fontSize: 18,
						marginBottom: 20,
					}}
				>
					Configure Quick Trade{' '}
					{selectedConfig?.symbol?.split('-')?.join('/')?.toUpperCase()}
				</div>

				<div style={{ marginBottom: 30 }}>
					Change liquidity and price source for{' '}
					{selectedConfig?.symbol?.split('-')?.join('/')?.toUpperCase()} Quick
					Trade market.
				</div>

				<div style={{ marginBottom: 30 }}>
					<Radio.Group
						onChange={(e) => {
							setSelectedType(e.target.value);
						}}
						value={editMode ? selectedType : selectedConfig?.type}
					>
						<Space direction="vertical">
							<Radio
								style={{ color: 'white' }}
								disabled={!disableNetwork}
								value={'network'}
							>
								<span style={{ color: !disableNetwork ? 'grey' : 'white' }}>
									HollaEx Network Swap
								</span>
							</Radio>
							<Radio
								style={{ color: 'white' }}
								disabled={!disableOrderbook}
								value={'pro'}
							>
								<span style={{ color: !disableOrderbook ? 'grey' : 'white' }}>
									Orderbook
								</span>
							</Radio>
							<Radio
								style={{ color: 'white' }}
								disabled={!disableBroker}
								value={'broker'}
							>
								<span style={{ color: !disableBroker ? 'grey' : 'white' }}>
									OTC Desk
								</span>{' '}
								<span
									onClick={(e) => {
										e.preventDefault();
										handleTabChange('2');
										handleCloseConfigModal();
									}}
									style={{ textDecoration: 'underline', color: 'white' }}
								>
									(Go to OTC Desk page)
								</span>
							</Radio>
						</Space>
					</Radio.Group>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 15,
						justifyContent: 'space-between',
						marginBottom: 20,
					}}
				>
					<Button
						onClick={() => {
							handleCloseConfigModal();
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Back
					</Button>
					<Button
						onClick={async () => {
							try {
								await updateQuickTradeConfig({
									symbol: selectedConfig.symbol,
									type: selectedType,
								});
								setQuickTradeConfig((prevState) => {
									const newState = [...prevState];
									const Index = newState.findIndex(
										(config) => config.symbol === selectedConfig.symbol
									);
									newState[Index].type = selectedType;
									return newState;
								});

								message.success('Changes applied.');
							} catch (err) {
								message.error(err?.data?.message);
							}
							handleCloseConfigModal();
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Confirm
					</Button>
				</div>

				<div style={{ textAlign: 'center' }}>
					Do you want to {selectedConfig?.active ? 'disable' : 'enable'} this
					Quick Trade market? {selectedConfig?.active ? 'Disable' : 'Enable'} it{' '}
					<span
						style={{ cursor: 'pointer', textDecoration: 'underline' }}
						onClick={() => {
							setDisplayWarning(true);
						}}
					>
						here
					</span>
					.
				</div>
			</Modal>

			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined style={{ color: 'white' }} />}
				bodyStyle={{
					backgroundColor: '#27339D',
				}}
				style={{ marginTop: 20 }}
				visible={displayWarning}
				footer={null}
				onCancel={() => {
					setDisplayWarning(false);
				}}
			>
				<div
					style={{
						fontWeight: '600',
						color: 'white',
						fontSize: 20,
						marginBottom: 20,
					}}
				>
					{selectedConfig?.active ? 'Disable' : 'Enable'}{' '}
					{selectedConfig?.symbol?.split('-')?.join('/')?.toUpperCase()} Quick
					Trade market
				</div>

				<div
					style={{ marginBottom: 30, padding: 30, backgroundColor: '#222C89' }}
				>
					The market will be{' '}
					{selectedConfig?.active ? 'inaccessible' : 'accessible'} to your
					users. Do you want to proceed?
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 15,
						justifyContent: 'space-between',
					}}
				>
					<Button
						onClick={() => {
							setDisplayWarning(false);
						}}
						style={{
							backgroundColor: '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Back
					</Button>
					<Button
						onClick={async () => {
							try {
								await updateQuickTradeConfig({
									symbol: selectedConfig.symbol,
									active: !selectedConfig.active,
								});
								setQuickTradeConfig((prevState) => {
									const newState = [...prevState];
									const Index = newState.findIndex(
										(config) => config.symbol === selectedConfig.symbol
									);
									newState[Index].active = !selectedConfig.active;
									return newState;
								});

								message.success(`Changes saved.`);
							} catch (err) {
								message.error(err?.data?.message);
							}
							setDisplayWarning(false);
							handleCloseConfigModal();
						}}
						style={{
							backgroundColor: selectedConfig?.active ? '#780000' : '#288500',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						Proceed and {selectedConfig?.active ? 'Disable' : 'Enable'}
					</Button>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (store) => ({
	coinData: store.app.coins,
	prices: store.orderbook.prices,
	balanceData: store.user.balance,
	oraclePrices: store.asset.oraclePrices,
	constants: store.app.constants,
	markets: MarketsSelector(store),
});

const mapDispatchToProps = (dispatch) => ({
	setPricesAndAsset: bindActionCreators(setPricesAndAsset, dispatch),
	setBroker: bindActionCreators(setBroker, dispatch),
	getTickers: bindActionCreators(getTickers, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuickTradeTab);
