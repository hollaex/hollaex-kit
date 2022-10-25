import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, Table, Modal, Breadcrumb, message, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { bindActionCreators } from 'redux';
import _get from 'lodash/get';

import CreatePair from '../CreatePair';
import Preview from '../CreatePair/Preview';
import Coins from '../Coins';
import IconToolTip from '../IconToolTip';
import { getTabParams } from '../AdminFinancials/Assets';
import Filter from '../FilterComponent';
import ApplyChangesConfirmation from '../ApplyChangesConfirmation';
import { setAllPairs, setCoins } from 'actions/assetActions';
import { storePair, updateAssetPairs } from './actions';
import { STATIC_ICONS } from 'config/icons';
import { getAllPairs, updateExchange } from '../AdminFinancials/action';

const { Item } = Breadcrumb;

export const renderStatus = ({ id, verified, created_by }, user_id) => {
	if (created_by !== user_id) {
		return null;
	}
	return (
		<div className="settings-toolTip coin-config-align">
			{!id && !verified ? (
				<Link to="/admin/financials?tab=0">
					<IconToolTip
						type="settings"
						tip="Click to complete the asset configuration"
					/>
				</Link>
			) : !verified ? (
				<Link to="/admin/financials?tab=0">
					<IconToolTip
						type="warning"
						tip="This asset is in pending verification"
					/>
				</Link>
			) : null}
		</div>
	);
};

const filterOptions = [
	{
		label: 'All',
		value: 'all',
		secondaryType: 'text',
		secondaryPlaceHolder: 'Input name or symbol',
	},
];

const COLUMNS = (
	pairs,
	allCoins = [],
	user = {},
	constants = {},
	handlePreview = () => {}
) => [
	{
		title: 'Market pairs',
		dataIndex: 'symbol',
		key: 'symbol',
		width: '45%',
		fixed: 'left',
		render: (symbol, { fullname = '', verified, basename, name, ...rest }) => {
			const pairData = symbol ? symbol.split('-') : name.split('-');
			let pair_base = pairData.length ? pairData[0] : '';
			let pair_2 = pairData.length ? pairData[1] : '';
			const pair_base_data =
				allCoins.filter((data) => data.symbol === pair_base)[0] || {};
			const pair2_data =
				allCoins.filter((data) => data.symbol === pair_2)[0] || {};
			let filterPair = pairs.filter((pair) => pair.code === rest.code)[0] || {};
			return (
				<div
					className="coin-symbol-wrapper"
					onClick={() =>
						handlePreview({
							...filterPair,
							verified,
							pair_base,
							pair_2,
							pair_base_data,
							pair2_data,
						})
					}
				>
					<div className="coin-title pairs">{pair_base_data.fullname}</div>
					<div className="config-content content-space2">
						<Coins
							color={pair_base_data.meta ? pair_base_data.meta.color : ''}
							type={pair_base.toLowerCase()}
							small={true}
						/>
						<div className="icon-wrapper">
							{renderStatus(pair_base_data, _get(constants, 'info.user_id'))}
						</div>
					</div>
					<div className="content-space1">
						<CloseOutlined />
					</div>
					<div className="config-content content-space1">
						<Coins
							color={pair2_data.meta ? pair2_data.meta.color : ''}
							type={pair_2.toLowerCase()}
							small={true}
						/>
						<div className="icon-wrapper">
							{renderStatus(pair2_data, _get(constants, 'info.user_id'))}
						</div>
					</div>
					<span className="content-space2 pairs">{pair2_data.fullname}</span>
					{verified ? (
						<IconToolTip type="success" tip="" animation={false} />
					) : (
						<IconToolTip
							type="warning"
							tip="This asset is in pending verification"
						/>
					)}
				</div>
			);
		},
	},
];

class PairsSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			isPreview: false,
			isConfigure: false,
			isEdit: false,
			step: 'step1',
			previewData: {},
			width: 520,
			filterValues: '',
			pairs: [],
			isConfirm: false,
			isPresetConfirm: false,
			coins: [],
			buttonSubmitting: false,
			saveLoading: false,
			isHovered: false,
			hoveredKey: 0,
		};
	}

	componentDidMount() {
		if (this.props.pairs.length && this.props.allPairs.length) {
			let pairs = this.props.allPairs.filter((data) =>
				this.props.pairs.includes(data.name)
			);
			this.setState({
				pairs,
			});
		}
		const tabParams = getTabParams();
		if (tabParams.isOpenPairModal) {
			this.setState({ isOpen: tabParams.isOpenPairModal });
		}
	}

	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(this.props.allPairs) !==
				JSON.stringify(prevProps.allPairs) ||
			JSON.stringify(this.props.pairs) !== JSON.stringify(prevProps.pairs)
		) {
			let pairs = this.props.allPairs.filter((data) =>
				this.props.pairs.includes(data.name)
			);
			this.setState({
				pairs,
			});
		}
		if (
			JSON.stringify(this.props.location) !== JSON.stringify(prevProps.location)
		) {
			const tabParams = getTabParams();
			if (tabParams.tab === '0') {
				if (tabParams.isViewDetails === 'true') {
					const previewData = this.state.pairs.filter(
						(data) => tabParams.currentPair === data.name
					);
					this.props.handleHide(true);
					this.setState({ isPreview: true, previewData: previewData[0] });
				} else {
					this.props.handleHide(false);
					this.setState({
						isPreview: false,
						isConfigure: false,
					});
				}
				if (tabParams.isOpenPairModal) {
					this.setState({ isOpen: tabParams.isOpenPairModal });
				}
			}
		}
	}

	getPairs = async () => {
		try {
			const res = await getAllPairs();
			if (res && res.data && res.data.data) {
				this.props.setAllPairs(res.data.data);
			}
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	handleCreateNew = () => {
		this.setState({ isOpen: true });
	};

	handleClose = () => {
		this.setState({
			isOpen: false,
			width: 520,
			isEdit: false,
			isConfirm: false,
		});
		const tabParams = getTabParams();
		if (tabParams.isOpenPairModal) {
			this.props.router.replace('/admin/trade?tab=0');
		}
	};

	handleWidth = (width) => {
		this.setState({ width: width ? width : 520 });
	};

	handlePreview = (data = {}) => {
		let previewPairData = {
			...data,
			estimated_price: data.estimated_price === null ? 1 : data.estimated_price,
		};
		this.props.handleHide(!this.state.isPreview);
		this.setState({
			isPreview: !this.state.isPreview,
			isConfigure: false,
			previewData: previewPairData,
		});
	};

	handleConfigure = () => {
		this.setState({ isConfigure: true, isPreview: false });
	};

	handleEdit = () => {
		this.setState({ isEdit: true, step: 'step2' });
	};

	handleFilterValues = (filterValues) => {
		this.setState({ filterValues });
	};

	onClickFilter = () => {
		const { filterValues } = this.state;
		const { allPairs, pairs } = this.props;
		let pairsData = allPairs.filter((data) => pairs.includes(data.name));
		const lowercasedValue = filterValues.toLowerCase();
		if (lowercasedValue) {
			let result = pairsData.filter((list = {}) => {
				return (
					(list.name && list.name.toLowerCase().includes(lowercasedValue)) ||
					(list.pair_2 &&
						list.pair_2.toLowerCase().includes(lowercasedValue)) ||
					(list.pair_base &&
						list.pair_base.toLowerCase().includes(lowercasedValue))
				);
			});
			this.setState({ pairs: result });
		} else {
			this.setState({ pairs: pairsData });
		}
	};

	handleDelete = async (formData) => {
		const { pairs = [], exchange = {} } = this.props;
		this.setState({ buttonSubmitting: true });
		try {
			let formProps = {
				id: exchange.id,
				pairs: pairs.filter(
					(data) => data !== `${formData.pair_base}-${formData.pair_2}`
				),
			};
			await updateExchange(formProps);
			await this.props.getMyExchange();
			await this.getPairs();
			message.success('Pair removed successfully');
			this.setState({
				isPreview: false,
				isConfigure: false,
				buttonSubmitting: false,
			});
			this.props.handleHide(false);
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
			this.setState({ buttonSubmitting: false });
		}
	};

	handleApply = async () => {
		try {
			// await requestApplyOnKit(this.props.exchange.id);
			message.success('Applied changes successfully');
			this.handleApplyClose();
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	handleApplyOpen = () => {
		this.setState({ isPresetConfirm: true });
	};

	handleApplyClose = () => {
		this.setState({ isPresetConfirm: false });
	};

	handleConfirm = async (
		formData,
		isEdit = false,
		isApply = false,
		isPresetAsset = false
	) => {
		this.setState({ saveLoading: true });
		if (isEdit) {
			try {
				delete formData.pair_base_data;
				delete formData.pair2_data;
				if (!formData.name) {
					formData.name = `${formData.pair_base}-${formData.pair_2}`;
				}
				await updateAssetPairs(formData);
				await this.props.getMyExchange();
				await this.getPairs();
				if (isApply) {
					await this.handleApply();
				}
				message.success('Pairs updated successfully');
				this.handleClose();
				if (this.state.isConfigure) {
					this.setState({ isPreview: true });
				}
				this.setState({ saveLoading: false });
			} catch (error) {
				if (error && error.data) {
					message.error(error.data.message);
				}
				this.setState({ saveLoading: false });
			}
		} else {
			const { pairs = [], exchange = {} } = this.props;
			try {
				if (!formData.name) {
					formData.name = `${formData.pair_base}-${formData.pair_2}`;
				}
				let coins = exchange.coins || [];

				if (
					!this.props.allPairs.filter((data) => data.name === formData.name)
						.length
				) {
					await storePair(formData);
					await this.getPairs();
				}

				if (!pairs.includes(formData.name)) {
					let formProps = {
						id: exchange.id,
						coins,
						pairs: [...pairs, `${formData.pair_base}-${formData.pair_2}`],
					};
					await updateExchange(formProps);
					await this.props.getMyExchange();
				}
				// if (isPresetAsset && exchange.is_running) {
				// 	this.handleApplyOpen();
				// }
				// if (isApply) {
				// 	await this.handleApply();
				// }
				this.handleClose();
				message.success('Pairs created successfully');
				this.setState({ saveLoading: false });
			} catch (error) {
				if (error && error.data) {
					message.error(error.data.message);
				}
				this.setState({ saveLoading: false });
			}
		}
	};

	handleEditData = (data) => {
		this.setState({ previewData: data });
	};

	handleApplyConfirmation = () => {
		if (this.props.exchange.is_running) {
			this.setState({ isConfirm: true });
		} else {
			this.handleConfirm(this.state.previewData, true);
		}
	};

	renderBreadcrumb = () => {
		return (
			<div>
				{this.state.isPreview || this.state.isConfigure ? (
					<Breadcrumb>
						<Item>
							<Link to="/admin/trade?tab=0">Orderbooks</Link>
						</Item>
						<Item
							className={
								this.state.isPreview || this.state.isConfigure
									? 'breadcrumb_active'
									: ''
							}
						>
							Manage market
						</Item>
					</Breadcrumb>
				) : null}
			</div>
		);
	};

	handleHover = (hoveredKey) => {
		this.setState((prevState) => ({
			isHovered: !prevState.isHovered,
			hoveredKey,
		}));
	};

	renderContent = (allCoins, pendingPairs, configurePairs) => {
		return (
			<div>
				{configurePairs.length ? (
					<div>
						{configurePairs.map((item, key) => {
							const pairs = item.split('-');
							const pair_base_fullname =
								(allCoins.filter((data) => data.symbol === pairs[0])[0] &&
									allCoins.filter((data) => data.symbol === pairs[0])[0]
										.fullname) ||
								'';
							const pair2_fullname =
								(allCoins.filter((data) => data.symbol === pairs[1])[0] &&
									allCoins.filter((data) => data.symbol === pairs[1])[0]
										.fullname) ||
								'';
							return (
								<div
									className="box-content"
									onMouseEnter={() => this.handleHover(key)}
									onMouseLeave={() => this.handleHover(key)}
									key={key}
								>
									<div className="d-flex justify-content-between">
										<div className="d-flex align-items-center">
											<Link
												to={`/admin/trade?tab=0&isOpenPairModal=true&pairs=${pairs[0]}-${pairs[1]}`}
												className="mr-1"
											>
												<IconToolTip
													type="settings"
													tip="Click to complete the market configuration"
												/>
											</Link>
											<div className="ml-4">
												{pair_base_fullname}/{pair2_fullname}
											</div>
											<div className="ml-2 grey-text">
												({pairs[0]}/{pairs[1]})
											</div>
										</div>
										<div className="text-end">
											<div>
												(
												<Link
													to={`/admin/trade?tab=0&isOpenPairModal=true&pairs=${pairs[0]}-${pairs[1]}`}
													className="text-underline"
												>
													Configure
												</Link>
												)
											</div>
											{this.state.isHovered && this.state.hoveredKey === key ? (
												<div className="small-txt">
													Click to complete configuration
												</div>
											) : (
												<div className="small-txt">
													Configuration incomplete
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : null}
				{pendingPairs.length ? (
					<div>
						{pendingPairs.map((item, key) => {
							const pair_base_fullname =
								allCoins.filter((data) => data.symbol === item.pair_base)[0]
									?.fullname || '';
							const pair2_fullname =
								allCoins.filter((data) => data.symbol === item.pair_2)[0]
									?.fullname || '';
							return (
								<div key={key} className="box-content">
									<div className="d-flex justify-content-between">
										<div className="d-flex align-items-center">
											<Link to="/admin/trade?tab=0">
												<IconToolTip
													type="warning"
													tip="This market is in pending verification"
												/>
											</Link>
											<div className="ml-4">
												{pair_base_fullname}/{pair2_fullname}
											</div>
											<div className="ml-2 grey-text">
												({item.pair_base}/{item.pair_2})
											</div>
										</div>
										<div className="text-end">
											<div>
												(
												<Link
													to={`/admin/trade?tab=0&isViewDetails=true&currentPair=${item.pair_base}-${item.pair_2}`}
													className="text-underline"
												>
													View
												</Link>
												)
											</div>
											<div className="orange-text small-txt">pending...</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : null}
			</div>
		);
	};
	renderPairContent = (configurePairs, pendingPairs) => {
		const { coins, allCoins, allPairs, constants, user } = this.props;
		let coinsData = allCoins.filter((val) => coins.includes(val.symbol));
		if (this.state.isPreview) {
			return (
				<div className="preview-container">
					{this.renderBreadcrumb()}
					<div className="d-flex justify-content-between flex-column-rev">
						<Preview
							coins={coinsData}
							allCoins={allCoins}
							isPreview={this.state.isPreview}
							formData={this.state.previewData}
							onEdit={this.handleEdit}
							onDelete={this.handleDelete}
							user_id={_get(constants, 'info.user_id')}
							buttonSubmitting={this.state.buttonSubmitting}
						/>
						<div>
							{this.state.previewData.created_by ===
							_get(constants, 'info.user_id') ? (
								<Button
									type="primary"
									className="configure-btn green-btn"
									onClick={this.handleConfigure}
								>
									Configure
								</Button>
							) : null}
						</div>
					</div>
				</div>
			);
		} else if (this.state.isConfigure) {
			return (
				<div className="preview-container">
					{this.renderBreadcrumb()}
					<div className="d-flex justify-content-between flex-column-rev">
						<Preview
							coins={coinsData}
							allCoins={allCoins}
							user_id={_get(constants, 'info.user_id')}
							isConfigure={this.state.isConfigure}
							formData={this.state.previewData}
							onEdit={this.handleEdit}
							onDelete={this.handleDelete}
							buttonSubmitting={this.state.buttonSubmitting}
						/>
						<div>
							<Button
								type="primary"
								className="configure-btn green-btn"
								onClick={this.handleApplyConfirmation}
								loading={this.state.saveLoading}
							>
								Save
							</Button>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="admin-pairs-container">
					<Fragment>
						<div className="orderbook-content mb-4">
							<div className="d-flex align-items-center header-icon-wrapper">
								<img
									src={STATIC_ICONS.PENDING_ORANGE_GEAR}
									className="active-status-icon"
									alt="active_icon"
								/>
								<div className="title align-title">Pending markets</div>
							</div>
							<div>
								Below is a list of markets that are incomplete and/or pending
								verification. Complete your market configurations to activate
							</div>
							<div className="box-container">
								{pendingPairs.length || configurePairs.length ? (
									<div>
										{this.renderContent(allCoins, pendingPairs, configurePairs)}
									</div>
								) : (
									<div className="no-markets">
										<div>No pending markets detected</div>
									</div>
								)}
							</div>
						</div>
						<div className="d-flex verify-icon-wrapper pl-3">
							<img
								src={STATIC_ICONS.VERIFICATION_VERIFIED}
								className="active-status-icon"
								alt="active_icon"
							/>
							<div>A list of all active markets</div>
						</div>
						<div className="filter-header">
							<Filter
								selectOptions={filterOptions}
								onChange={this.handleFilterValues}
								onClickFilter={this.onClickFilter}
							/>
							<Button
								type="primary"
								className="green-btn"
								onClick={this.handleCreateNew}
							>
								Create/add market
							</Button>
						</div>
						<div className="summary table-wrapper admin-tiers-wrapper">
							<Table
								columns={COLUMNS(
									allPairs,
									allCoins,
									user,
									constants,
									this.handlePreview
								)}
								rowKey={(data, index) => index}
								dataSource={this.state.pairs}
								bordered
							/>
						</div>
					</Fragment>
				</div>
			);
		}
	};

	renderModalContent = () => {
		const { isConfirm, isOpen, isEdit, step, previewData } = this.state;
		if (isConfirm) {
			return (
				<div className="preview-container">
					<div className="title">Apply changes to live exchange</div>
					<div>Do you want to apply changes to the live website now?</div>
					<div className="btn-wrapper">
						<Button
							type="primary"
							className="green-btn"
							onClick={() => this.handleConfirm(previewData, true)}
						>
							Save without applying
						</Button>
						<div className="separator"></div>
						<Button
							type="primary"
							className="green-btn"
							onClick={() => this.handleConfirm(previewData, true, true)}
						>
							Save and apply
						</Button>
					</div>
				</div>
			);
		} else if (isOpen || isEdit) {
			return (
				<CreatePair
					isEdit={isEdit}
					step={step}
					previewData={previewData}
					handleWidth={this.handleWidth}
					handleConfirm={this.handleConfirm}
					editDataCallback={this.handleEditData}
					onClose={this.handleClose}
					router={this.props.router}
					getMyExchange={this.props.getMyExchange}
				/>
			);
		}
	};

	render() {
		const { isConfirm, width, isOpen, isEdit, isPresetConfirm } = this.state;
		const { allPairs, pairs = [] } = this.props;
		let allPairSymbols = allPairs.map((item) => item.code);
		let configurePairs = pairs.filter((data) => !allPairSymbols.includes(data));
		const pendingPairs =
			allPairs &&
			allPairs.filter((data) => pairs.includes(data.name) && !data.verified);
		if (!this.state.pairs || !this.state.pairs.length) {
			return <Spin size="large" className="m-top" />;
		}
		return (
			<div className="admin-pairs-container">
				{this.renderPairContent(configurePairs, pendingPairs)}
				<Modal
					width={`${width}px`}
					visible={isOpen || isEdit || isConfirm}
					onCancel={this.handleClose}
					footer={null}
				>
					{this.renderModalContent()}
				</Modal>
				<ApplyChangesConfirmation
					isVisible={isPresetConfirm}
					handleApply={this.handleApply}
					handleClose={this.handleApplyClose}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		exchange: state.asset && state.asset.exchange ? state.asset.exchange : {},
		coins:
			(state.asset && state.asset.exchange && state.asset.exchange.coins) || [],
		pairs:
			(state.asset && state.asset.exchange && state.asset.exchange.pairs) || [],
		allPairs: state.asset.allPairs,
		allCoins: state.asset.allCoins,
		constants: state.app.constants,
		user: state.user,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setCoins: bindActionCreators(setCoins, dispatch),
	setAllPairs: bindActionCreators(setAllPairs, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PairsSummary);
