import React, { Component, Fragment } from 'react';
import { Button, Table, Modal, Breadcrumb, message } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _cloneDeep from 'lodash/cloneDeep';
import { bindActionCreators } from 'redux';
// import { requestExchange } from './action';
import _get from 'lodash/get';

import CreateAsset, { default_coin_data } from '../CreateAsset';
import FinalPreview from '../CreateAsset/Final';
import IconToolTip from '../IconToolTip';
import Coins from '../Coins';
import Filter from '../FilterComponent';
import ApplyChangesConfirmation from '../ApplyChangesConfirmation';
import {
	getAllCoins,
	getExchange,
	updateAssetCoins,
	updateExchange,
	uploadCoinLogo,
} from './action';
import { setCoins, setExchange } from 'actions/assetActions';
import { requestTotalBalance } from '../Wallets/actions';

const { Item } = Breadcrumb;

const ASSET_TYPE_LIST = [
	{ key: 'Bitcoin', value: 'btc' },
	{ key: 'Bitcoin Cash', value: 'bch' },
	{ key: 'Ripple', value: 'xrp' },
	{ key: 'Ethereum', value: 'eth' },
	{ key: 'HollaEx', value: 'hex' },
	{ key: 'HollaEx', value: 'xht' },
	{ key: 'Bitcoin Satoshi Vision', value: 'bsv' },
	{ key: 'USD Tether', value: 'usdt' },
	{ key: 'BNB', value: 'bnb' },
	{ key: 'UNUS SED LEO', value: 'leo' },
	{ key: 'Maker', value: 'mkr' },
	{ key: 'USD Coin', value: 'usdc' },
	{ key: 'BAT', value: 'bat' },
	{ key: 'Monero', value: 'xmr' },
	{ key: 'EOS', value: 'eos' },
	{ key: 'Litecoin', value: 'ltc' },
	{ key: 'Stellar', value: 'xlm' },
	{ key: 'Cardano', value: 'ada' },
	{ key: 'Tron', value: 'trx' },
	{ key: 'NEO', value: 'neo' },
	{ key: 'NEM', value: 'nem' },
	{ key: 'Ethereum Classic', value: 'etc' },
	{ key: 'Dash', value: 'dash' },
	{ key: 'IOTA', value: 'miota' },
	{ key: 'ZRX', value: 'zrx' },
	{ key: 'Gold Tether', value: 'xaut' },
];

const filterOptions = [
	{
		label: 'All',
		value: 'all',
		secondaryType: 'text',
		secondaryPlaceHolder: 'Input name or symbol',
	},
];

export const getTabParams = () => {
	let paramsString = window.location.search.replace('?', '');
	let activeTab = {};
	if (paramsString.length) {
		let splitValue = paramsString.split('&');
		splitValue.forEach((value) => {
			let temp = value.split('=');
			activeTab[temp[0]] = temp[1];
		});
	}
	return activeTab;
};

const getColumns = (
	allCoins = [],
	constants = {},
	balance = {},
	handleEdit,
	handlePreview
) => [
	{
		title: 'Assets',
		key: 'symbol',
		render: (data) => {
			const selectedAsset =
				_cloneDeep(allCoins.filter((list) => list.symbol === data.symbol)[0]) ||
				{};
			if (!data.id && selectedAsset.id) {
				delete selectedAsset.id;
			}
			if (!selectedAsset.symbol) {
				selectedAsset.symbol = data.symbol;
			}
			return (
				<div
					className="coin-symbol-wrapper"
					onClick={() => handlePreview(selectedAsset)}
				>
					<div className="currency_ball">
						<Coins
							type={data.symbol.toLowerCase()}
							small={true}
							color={selectedAsset.meta ? selectedAsset.meta.color : ''}
							fullname={selectedAsset.fullname}
							onClick={() => handlePreview(selectedAsset)}
						/>
						<div className="fullName">{selectedAsset.fullname}</div>
					</div>
					{data.id && data.verified ? (
						<IconToolTip type="success" tip="" animation={false} />
					) : data.id && !data.verified ? (
						<IconToolTip
							type="warning"
							tip="This asset is in pending verification"
							onClick={(e) => {
								if (
									selectedAsset.created_by === _get(constants, 'info.user_id')
								) {
									handleEdit(selectedAsset, e);
								}
							}}
						/>
					) : selectedAsset.created_by === _get(constants, 'info.user_id') ? (
						<div className="config-content">
							(
							<span
								className="link"
								onClick={(e) => handleEdit(selectedAsset, e)}
							>
								Configure
							</span>
							)
							<IconToolTip
								type="settings"
								tip="Click to complete the asset configuration"
								onClick={(e) => handleEdit(selectedAsset, e)}
							/>
						</div>
					) : null}
				</div>
			);
		},
	},
	{
		title: 'Status',
		dataIndex: 'verified',
		key: 'verified',
		className: 'balance-column',
		render: (verified) => {
			return verified ? <div>verified</div> : <div>pending</div>;
		},
	},
	{
		title: 'Balance',
		dataIndex: 'symbol',
		key: 'balance',
		className: 'balance-column',
		render: (symbol = '', data) => {
			const selectedAsset =
				allCoins.filter((list) => list.symbol === data.symbol)[0] || {};
			return (
				<div
					className="coin-symbol-wrapper"
					onClick={() => handlePreview(selectedAsset)}
				>
					{balance[`${symbol}_available`] || 0}
				</div>
			);
		},
	},
];

class Assets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpenAdd: false,
			isEdit: false,
			width: 520,
			coins: [],
			isPreview: false,
			isConfigure: false,
			isConfigureEdit: false,
			editConfigureScreen: 'edit-supply',
			selectedAsset: {},
			exchange: {},
			filterValues: '',
			status: '',
			tabParams: getTabParams(),
			isConfirm: false,
			exchangeUsers: [],
			userEmails: [],
			isPresetConfirm: false,
			exchangeBalance: {},
			formData: {},
			saveLoading: false,
			submitting: false,
			isWithdrawalEdit: false,
			isTableLoading: true,
			isFiat: '',
			assetType: '',
		};
	}

	componentDidMount() {
		// this.getMyExchange();
		this.getBalance();
		const { exchange, allCoins, isPreview, selectedAsset } = this.props;
		const { tabParams } = this.state;

		let coins = allCoins.filter(
			(val) => exchange && exchange.coins && exchange.coins.includes(val.symbol)
		);
		if (exchange && exchange.coins) {
			this.setState({
				coins: coins || [],
				exchange,
			});
		}
		if (Object.keys(tabParams).length) {
			let isAddAsset = tabParams.isAsset === 'true';
			let isPreview = tabParams.preview === 'true';
			let coinData = coins;
			if (coinData.length) {
				let temp = coinData.filter((list) => list.symbol === tabParams.symbol);
				let filterCoin = temp.length ? temp[0] : {};
				if (filterCoin.symbol) {
					let filterSymbol = filterCoin.symbol;
					filterCoin =
						allCoins.filter((list) => list.symbol === filterSymbol)[0] || {};
				}
				this.props.handleHide(isPreview);
				if (!Object.keys(filterCoin).length && tabParams?.isFiat) {
					filterCoin =
						allCoins.filter((item) => item.symbol === tabParams?.symbol)[0] ||
						{};
				}
				this.setState({
					isPreview,
					isOpenAdd: isAddAsset,
					selectedAsset: {
						...default_coin_data,
						...filterCoin,
					},
					isFiat: tabParams.isFiat,
				});
			}
		}
		if (isPreview) {
			this.setState({ isPreview: true, selectedAsset });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { exchange, allCoins } = this.props;
		if (
			(JSON.stringify(prevProps.exchange) !== JSON.stringify(exchange) &&
				exchange &&
				exchange.coins &&
				allCoins) ||
			(JSON.stringify(prevProps.allCoins) !== JSON.stringify(allCoins) &&
				exchange &&
				exchange.coins &&
				allCoins)
		) {
			const coins = allCoins.filter((val) =>
				exchange.coins.includes(val.symbol)
			);
			this.setState({
				coins: coins || [],
				exchange: exchange,
			});
		}

		if (
			JSON.stringify(this.props.location) !== JSON.stringify(prevProps.location)
		) {
			const tabParams = getTabParams();
			if (tabParams.isAssetHome === 'true') {
				this.props.handleHide(false);
				this.setState({
					isPreview: false,
					isConfigure: false,
				});
			}
		}
	}

	getBalance = async () => {
		try {
			const res = await requestTotalBalance();
			if (res) {
				this.setState({ exchangeBalance: res });
			}
		} catch (error) {
			const errMsg = error.data ? error.data.message : error.message;
			message.error(errMsg);
		}
	};

	updateFormData = (name, value) => {
		const { formData } = this.state;
		if (name === 'color') {
			formData.meta = { color: value };
		} else if (name === 'decimal_points') {
			formData.meta = {
				...formData.meta,
				decimal_points: value,
			};
		} else {
			formData[name] = value;
		}
		this.setState({ formData });
	};

	handleClose = () => {
		this.setState({
			isOpenAdd: false,
			isEdit: false,
			isConfigureEdit: false,
			isConfirm: false,
			width: 520,
			isWithdrawalEdit: false,
			// selectedAsset: {}
		});
	};

	handleCreateNew = () => {
		this.setState({ isOpenAdd: true });
	};

	handleWidth = (width) => {
		this.setState({ width: width ? width : 520 });
	};

	getMyExchange = async () => {
		try {
			const res = await getExchange();
			const exchange = res.data;
			this.props.setExchange(exchange);
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	getCoins = async () => {
		try {
			const res = await getAllCoins();

			const coins =
				(await res.data) &&
				res.data.data &&
				res.data.data.map((item) => {
					// NOTE: Monero set disabled
					if (item.symbol === 'xmr') {
						return {
							key: 'Monero',
							value: 'xmr',
							disabled: true,
							...item,
						};
					}
					const filter = ASSET_TYPE_LIST.filter(
						(obj) => obj.value === item.symbol
					);
					if (filter.length === 0) {
						return {
							key: item.fullname,
							value: item.symbol,
							...item,
						};
					} else {
						return { ...filter[0], ...item };
					}
				});

			return this.props.setCoins(coins);
		} catch (error) {
			throw error;
		}
	};

	handleRefreshCoin = async (coinData) => {
		const { coins, exchange } = this.state;
		try {
			let coinList = coins.map((data) => data.symbol);
			let formProps = {
				id: exchange.id,
				coins: [...coinList, coinData.symbol],
			};
			await updateExchange(formProps);
			await this.getMyExchange();
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	handleConfirmation = async (
		coinFormData = {},
		isEdit = false,
		isApply = false,
		isPresetAsset = false
	) => {
		const { coins, exchange, isConfigure, selectedAsset } = this.state;
		const { logoFile, iconName, ...coinData } = coinFormData;
		if (isEdit) {
			try {
				this.setState({ saveLoading: true });
				// if (!coinData.logo || selectedAsset.logo) {
				//     coinData.logo = ''
				// }
				delete coinData.key;
				delete coinData.value;
				// delete coinData.iconName;
				// if (coinData.symbol) {
				// 	coinData.symbol = coinData.symbol.toLowerCase();
				// }
				// if (!coinData.network) coinData.network = '';
				// if (!coinData.standard) coinData.standard = '';
				// if (!coinData.estimated_price) {
				//     coinData.estimated_price = 1;
				// }
				// if (!coinData.fullname) coinData.fullname = selectedAsset.fullname;
				// if (!coinData.symbol) coinData.symbol = selectedAsset.symbol;
				// if (!coinData.min) coinData.min = selectedAsset.min;
				// if (!coinData.max) coinData.max = selectedAsset.max;
				// if (!coinData.increment_unit)
				// 	coinData.increment_unit = selectedAsset.increment_unit;
				if (!coinData.code) coinData.code = selectedAsset.code;
				if (logoFile) {
					let formData = new FormData();
					formData.append('name', iconName);
					formData.append('file_name', iconName);
					formData.append('file', logoFile);
					const logo = await uploadCoinLogo(formData);
					coinData.logo = _get(logo, 'data.path', '');
				}

				await updateAssetCoins(coinData);
				await this.getCoins();
				this.setState({ formData: {}, saveLoading: false });
				// if (isApply) {
				// 	await this.handleApply();
				// }
				message.success('Assets updated successfully');
				this.handleClose();
				if (isConfigure) {
					this.setState({ isConfigure: false, isPreview: true, formData: {} });
				}
			} catch (error) {
				this.setState({ saveLoading: false });
				if (error && error.data) {
					message.error(error.data.message);
				}
			}
		} else {
			try {
				this.setState({ saveLoading: true });
				if (!coinData.logo) {
					coinData.logo = '';
				}
				delete coinData.key;
				delete coinData.value;
				delete coinData.iconName;
				// delete coinData.code;
				if (coinData.symbol) {
					coinData.symbol = coinData.symbol.toLowerCase();
				}
				// let pairs = exchange.pairs || [];
				let coinList = coins.map((data) => data.symbol);

				if (!coinData.id) {
					if (!coinData.code) {
						coinData.code = coinData.symbol.toLowerCase();
					}
					await updateAssetCoins(coinData);
				}
				if (!coinList.includes(coinData.symbol)) {
					let formProps = {
						id: exchange.id,
						// pairs: pairs.map(data => data.name ? data.name : data.symbol),
						coins: [...coinList, coinData.symbol],
					};
					await updateExchange(formProps);
				}
				await this.getMyExchange();
				await this.getCoins();
				if (isPresetAsset && exchange.is_running) {
					this.setState({ isPresetConfirm: true });
				}
				// if (isApply) {
				// 	await this.handleApply();
				// }
				this.handleClose();
				this.setState({ saveLoading: false, formData: {} });
				message.success('Asset created successfully');
			} catch (error) {
				this.setState({ saveLoading: false });
				if (error && error.data) {
					message.error(error.data.message);
				}
			}
		}
	};

	handleDelete = async (symbol) => {
		const { coins, exchange } = this.state;
		this.setState({ submitting: true });
		try {
			let formProps = {
				id: exchange.id,
				coins: coins
					.filter((data) => data.symbol !== symbol)
					.map((data) => data.symbol),
				pairs: exchange.pairs.filter((data) => {
					let pairData = data.split('-');
					return pairData[0] !== symbol && pairData[1] !== symbol;
				}),
			};
			await updateExchange(formProps);
			await this.getMyExchange();
			await this.getCoins();
			message.success('Asset removed successfully');
			this.setState({
				isConfigure: false,
				isPreview: false,
				submitting: false,
			});
			this.props.handleHide(false);
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
			this.setState({ submitting: false });
		}
	};

	handleEdit = (asset, event) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({ selectedAsset: asset, isEdit: true });
	};

	handlePreview = (asset) => {
		this.props.handleHide(true);
		this.setState({
			isPreview: true,
			selectedAsset: asset,
			status: asset.status,
			formData: {},
		});
	};

	handleConfigure = () => {
		// this.props.handleHide(true);
		this.setState({ isConfigure: true, isPreview: false });
	};

	handleFilterValues = (filterValues) => {
		this.setState({ filterValues });
	};

	onClickFilter = () => {
		const { filterValues } = this.state;
		const { allCoins, exchange } = this.props;
		const coinData = allCoins.filter((val) =>
			exchange.coins.includes(val.symbol)
		);
		const lowercasedValue = filterValues.toLowerCase();
		if (lowercasedValue) {
			let result = coinData.filter((list) => {
				return (
					list.symbol.toLowerCase().includes(lowercasedValue) ||
					list.fullname.toLowerCase().includes(lowercasedValue)
				);
			});
			this.setState({ coins: result });
		} else {
			this.setState({ coins: coinData });
		}
	};

	handleEditData = (data) => {
		this.setState({ selectedAsset: data });
	};

	renderLink = (isFiat) => {
		if (isFiat === 'onRamp') {
			return <Link to="/admin/fiat?tab=2">Fiat controls</Link>;
		} else if (isFiat === 'offRamp') {
			return <Link to="/admin/fiat?tab=3">Fiat controls</Link>;
		} else {
			return <Link to="/admin/financials?tab=0&isAssetHome=true">Assets</Link>;
		}
	};

	renderBreadcrumb = () => {
		return (
			<div>
				{this.state.isPreview || this.state.isConfigure ? (
					<Breadcrumb>
						<Item>{this.renderLink(this.state.isFiat)}</Item>
						<Item
							className={
								this.state.isPreview || this.state.isConfigure
									? 'breadcrumb_active'
									: ''
							}
						>
							Manage asset
						</Item>
					</Breadcrumb>
				) : null}
			</div>
		);
	};

	applyConfirmation = () => {
		const { formData } = this.state;
		if (this.state.exchange.is_running) {
			this.setState({ isConfirm: true });
		} else {
			this.handleConfirmation(formData, true);
		}
	};

	handleConfigureEdit = (key) => {
		this.setState({
			isConfigureEdit: true,
			editConfigureScreen: key,
		});
	};

	handleWithdrawalEdit = (assetType) => {
		this.handleConfigureEdit('edit_withdrawal_fees');
		this.setState({ isWithdrawalEdit: true, assetType });
	};

	renderPreview = () => {
		const {
			constants: {
				info: { user_id },
			},
			fiat,
		} = this.props;

		const {
			selectedAsset,
			isConfigure,
			isPreview,
			exchangeUsers,
			userEmails,
			submitting,
			saveLoading,
			isFiat,
		} = this.state;

		const { owner_id, created_by, verified } = selectedAsset;
		const showMintAndBurnButtons = verified && owner_id === user_id;
		const showConfigureButton = created_by === user_id || owner_id === user_id;

		if (isConfigure) {
			return (
				<div className="overview-wrap">
					<div className="preview-container">
						{!fiat && this.renderBreadcrumb()}
						<FinalPreview
							isConfigure
							coinFormData={selectedAsset}
							user_id={user_id}
							setConfigEdit={this.handleConfigureEdit}
							handleFileChange={this.handleFileChange}
							handleDelete={this.handleDelete}
							submitting={submitting}
							handleWithdrawalEdit={this.handleWithdrawalEdit}
						/>
					</div>
					<div>
						<Button
							type="primary"
							className="configure-btn green-btn"
							onClick={this.applyConfirmation}
							loading={saveLoading}
						>
							Save
						</Button>
					</div>
				</div>
			);
		} else if (isPreview) {
			return (
				<div className="overview-wrap">
					<div className="preview-container">
						{!fiat && this.renderBreadcrumb()}
						<FinalPreview
							isPreview
							coinFormData={selectedAsset}
							user_id={user_id}
							handleEdit={this.handleEdit}
							handleDelete={this.handleDelete}
							setConfigEdit={this.handleConfigureEdit}
							exchangeUsers={exchangeUsers}
							userEmails={userEmails}
							submitting={submitting}
							handleWithdrawalEdit={this.handleWithdrawalEdit}
							isFiat={isFiat}
						/>
					</div>
					{showConfigureButton && (
						<div>
							<div className="d-flex">
								<Button
									type="primary"
									className="green-btn"
									onClick={this.handleConfigure}
								>
									Configure
								</Button>
								<div className="separator" />
								{showMintAndBurnButtons && (
									<Fragment>
										<Button
											className="green-btn"
											type="primary"
											onClick={() => this.handleConfigureEdit('mint')}
										>
											Mint
										</Button>
										<div className="separator" />
										<Button
											className="green-btn"
											type="primary"
											onClick={() => this.handleConfigureEdit('burn')}
										>
											Burn
										</Button>
									</Fragment>
								)}
							</div>
						</div>
					)}
				</div>
			);
		}
	};

	handleApply = async () => {
		try {
			// await requestApplyOnKit(this.state.exchange.id);
			message.success('Applied changes successfully');
			this.handleConfirmationClose();
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	handleConfirmationClose = () => {
		this.setState({ isPresetConfirm: false });
	};

	handleFileChange = async (event, name) => {
		const file = event.target.files[0];
		if (file) {
			// const base64Url = await new Promise((resolve, reject) => {
			// 	const reader = new FileReader();
			// 	reader.readAsDataURL(file);
			// 	reader.onload = () => resolve(reader.result);
			// 	reader.onerror = (error) => reject(error);
			// });
			const coinFormData = {
				...this.state.selectedAsset,
				[name]: file,
				logoFile: file,
				iconName: file.name,
			};
			this.handleEditData(coinFormData);
			this.updateFormData(name, file);
			this.updateFormData('logoFile', file);
			this.updateFormData('iconName', file.name);
		}
	};

	renderModalContent = () => {
		const {
			// coins,
			isOpenAdd,
			isEdit,
			isConfigureEdit,
			editConfigureScreen,
			selectedAsset,
			isConfirm,
			exchangeUsers,
			userEmails,
			formData,
			saveLoading,
		} = this.state;
		const { allCoins } = this.props;
		if (isConfirm) {
			return (
				<div className="admin-asset-wrapper">
					<div className="title">Apply changes to live exchange</div>
					<div>Do you want to apply changes to the live website now?</div>
					<div className="btn-wrapper">
						<Button
							type="primary"
							className="apply-btn"
							onClick={() => this.handleConfirmation(formData, true)}
							disabled={saveLoading}
						>
							Save without applying
						</Button>
						<div className="separator"></div>
						<Button
							type="primary"
							className="apply-btn"
							onClick={() => this.handleConfirmation(formData, true, true)}
							disabled={saveLoading}
						>
							Save and apply
						</Button>
					</div>
				</div>
			);
		} else if (isOpenAdd || isEdit || isConfigureEdit) {
			return (
				<CreateAsset
					isOpenAdd={isOpenAdd}
					isEdit={isEdit}
					editAsset={selectedAsset}
					isConfigureEdit={isConfigureEdit}
					editConfigureScreen={editConfigureScreen}
					// coins={coins}
					coins={allCoins}
					handleEditDataCallback={this.handleEditData}
					handleWidth={this.handleWidth}
					handleConfirmation={this.handleConfirmation}
					onClose={this.handleClose}
					exchangeUsers={exchangeUsers}
					userEmails={userEmails}
					updateFormData={this.updateFormData}
					getCoins={this.getCoins}
					formData={formData}
					exchangeCoins={this.state.coins}
					handleRefreshCoin={this.handleRefreshCoin}
					isWithdrawalEdit={this.state.isWithdrawalEdit}
					assetType={this.state.assetType}
				/>
			);
		}
		return null;
	};

	render() {
		const {
			isPreview,
			isConfigure,
			coins,
			isOpenAdd,
			isEdit,
			isConfigureEdit,
			width,
			isConfirm,
			isPresetConfirm,
			exchangeBalance,
			// exchange
		} = this.state;
		const { allCoins, constants } = this.props;

		return (
			<div className="admin-asset-wrapper">
				{isPreview || isConfigure ? (
					this.renderPreview()
				) : (
					<Fragment>
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
								Create/add asset
							</Button>
						</div>
						<div className="table-wrapper">
							<Table
								columns={getColumns(
									allCoins,
									constants,
									exchangeBalance,
									this.handleEdit,
									this.handlePreview
								)}
								rowKey={(data, index) => index}
								dataSource={coins}
								loading={!coins.length}
							/>
						</div>
					</Fragment>
				)}
				<Modal
					visible={
						isOpenAdd ||
						isEdit ||
						isConfigureEdit ||
						isConfirm ||
						isPresetConfirm
					}
					footer={null}
					width={`${width}px`}
					onCancel={this.handleClose}
				>
					{this.renderModalContent()}
				</Modal>
				<ApplyChangesConfirmation
					isVisible={isPresetConfirm}
					handleApply={this.handleApply}
					handleClose={this.handleConfirmationClose}
				/>
			</div>
		);
	}
}
const mapDispatchToProps = (dispatch) => ({
	setCoins: bindActionCreators(setCoins, dispatch),
	setExchange: bindActionCreators(setExchange, dispatch),
});
const mapStateToProps = (state) => ({
	allCoins: state.asset.allCoins,
	constants: state.app.constants,
	exchange: state.asset && state.asset.exchange,
});

export default connect(mapStateToProps, mapDispatchToProps)(Assets);
