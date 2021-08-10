import React, { Component, Fragment } from 'react';
import { Button, Table, Modal, Breadcrumb, message } from 'antd';
import { connect } from 'react-redux';
// import { requestExchange } from './action';

import CreateAsset from '../CreateAsset';
import FinalPreview from '../CreateAsset/Final';
import IconToolTip from 'components/IconToolTip';
import Coins from 'components/Coins';

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
    { key: 'Gold Tether', value: 'xaut' }
];

const getColumns = (allCoins = [], user = {}, balance = {}, handleEdit, handlePreview) => [
    {
        title: 'Assets',
        key: 'symbol',
        render: (data) => {
            const selectedAsset = {};
            if (!data.id && selectedAsset.id) {
                delete selectedAsset.id;
            }
            if (!selectedAsset.symbol) {
                selectedAsset.symbol = data.symbol
            }
            return (
                <div className="coin-symbol-wrapper" onClick={() => handlePreview(data)} >
                    <div className="currency_ball">
                        <Coins
                            type={data.symbol.toLowerCase()}
                            small={true}
                            color={selectedAsset.meta
                                ? selectedAsset.meta.color
                                : ''
                            }
                            fullname={selectedAsset.fullname}
                            onClick={() => handlePreview(selectedAsset)}
                        />
                        <div className="fullName">{data.fullname}</div>
                    </div>
                    {(data.id && data.verified)
                        ? <IconToolTip type="success" tip="" animation={false} />
                        : (data.id && !data.verified)
                            ? <IconToolTip
                                type="warning"
                                tip="This asset is in pending verification"
                                onClick={(e) => {
                                    if (selectedAsset.created_by === user.id) {
                                        handleEdit(selectedAsset, e)
                                    }
                                }}
                            />
                            : (selectedAsset.created_by === user.id)
                                ?
                                <div className="config-content">
                                    (<span className="link" onClick={(e) => handleEdit(selectedAsset, e)}>Configure</span>)
                                    <IconToolTip
                                        type="settings"
                                        tip="Click to complete the asset configuration"
                                        onClick={(e) => handleEdit(selectedAsset, e)}
                                    />
                                </div>
                                : null
                    }
                </div>
            )
        }
    },
    {
        title: 'Status',
        dataIndex: 'verified',
        key: 'verified',
        className: 'balance-column',
        render: (verified) => {
            return verified ? <div>verified</div> : <div>pending</div>;
        }
    },
    {
        title: 'Balance',
        dataIndex: 'symbol',
        key: 'balance',
        className: 'balance-column',
        render: (symbol = '', data) => {
            const selectedAsset = {};
            return (<div className="coin-symbol-wrapper" onClick={() => handlePreview(selectedAsset)}>{balance[symbol] || 0}</div>)
        }
    }
];

class Assets extends Component {
    constructor(props) {
        super(props)
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
            // tabParams: getTabParams(),
            isConfirm: false,
            exchangeUsers: [],
            userEmails: [],
            isPresetConfirm: false,
            exchangeBalance: {},
            formData: {},
        }
    }

    componentDidMount() {
        // this.requestExchange(this.props.exchange && this.props.exchange.id);
        if (this.props.exchange
            && this.props.exchange.length
        ) {
            this.setState({
                coins: this.props.exchange[0].coins || [],
                exchange: this.props.exchange[0]
            });
        }
        // if (tabParams) {
        //     let isAddAsset = (tabParams.isAsset === 'true');
        //     let isPreview = (tabParams.preview === 'true');
        //     let coinData = this.props.exchange[0].coins;
        //     if (coinData.length) {
        //         let temp = coinData.filter(list => list.symbol === tabParams.symbol)
        //         let filterCoin = temp.length ? temp[0] : {};
        //         if (filterCoin.symbol) {
        //             let filterSymbol = filterCoin.symbol;
        //             filterCoin = this.props.allCoins.filter(list => list.symbol === filterSymbol)[0] || {};
        //         }
        //         this.props.handleHide(isPreview);
        //         this.setState({
        //             isPreview,
        //             isOpenAdd: isAddAsset,
        //             selectedAsset: {
        //                 ...default_coin_data,
        //                 ...filterCoin
        //             }
        //         })
        //     }
        // }
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.exchange) !== JSON.stringify(this.props.exchange)
            && this.props.exchange.length
        ) {
            this.setState({
                coins: this.props.exchange[0].coins || [],
                exchange: this.props.exchange[0]
            });
        }
        // if (JSON.stringify(this.props.location) !== JSON.stringify(prevProps.location)) {
        //     const tabParams = getTabParams();
        //     if (tabParams.tab === '0') {
        //         this.props.handleHide(false);
        //         this.setState({
        //             isPreview: false,
        //             isConfigure: false
        //         })
        //     }
        // }
        if (JSON.stringify(prevState.exchange) !== JSON.stringify(this.state.exchange)) {
            this.getAllUsers();
            this.getExchangeBalance();
        }
    }

    // requestExchange = (values) => {
    //     return requestExchange(values)
    //         .then((res) => {
    //             if (res.data) {
    //                 this.setState({ exchange: res.data });
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('error', error);
    //         });
    // };

    updateFormData = (name, value) => {
        const { formData } = this.state;
        if (name === 'color') {
            formData.meta = { color: value };
        } else {
            formData[name] = value;
        }
        this.setState({ formData });
    }
    getAllUsers = async () => {
        try {
            // const res = await getExchangeUsers(this.state.exchange.id);
            const res = {};
            if (res.data && res.data.data) {
                const exchangeUsers = res.data.data || [];
                this.setState({
                    exchangeUsers,
                    userEmails: exchangeUsers.map(user => user.email)
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    getExchangeBalance = async () => {
        try {
            // const res = await getExchangeBalance(this.state.exchange.id);
            const res = {};
            if (res.data) {
                this.setState({
                    exchangeBalance: res.data
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    handleClose = () => {
        this.setState({
            isOpenAdd: false,
            isEdit: false,
            isConfigureEdit: false,
            isConfirm: false,
            width: 520,
            // selectedAsset: {}
        });
    };

    handleCreateNew = () => {
        this.setState({ isOpenAdd: true });
    };

    handleWidth = (width) => {
        this.setState({ width: width ? width : 520 });
    };

    getExchange = async () => {
        try {
            // const res = await getExchange();
            const res = {};
            const exchange = res.data && res.data.data && res.data.data.sort((a, b) => {
                const ad = new Date(a.updated_at);
                const bd = new Date(a.updated_at);
                if (Math.floor(ad - bd) >= 0) {
                    return a - b;
                } else {
                    return b - a;
                }
            });

            this.props.actions.readData(exchange);
        } catch (error) {
            if (error && error.data) {
                message.error(error.data.message)
            }
        }
    };

    getCoins = async () => {
        try {
            // const res = await getCoins();
            const res = {};
            const coins = await res.data && res.data.data && res.data.data.map((item) => {
                // NOTE: Monero set disabled
                if (item.symbol === 'xmr') {
                    return {
                        key: 'Monero',
                        value: 'xmr',
                        disabled: true,
                        ...item
                    };
                }
                const filter = ASSET_TYPE_LIST.filter((obj) => obj.value === item.symbol);
                if (filter.length === 0) {
                    return {
                        key: item.fullname,
                        value: item.symbol,
                        ...item
                    };
                } else {
                    return { ...filter[0], ...item };
                }
            });

            return this.props.setCoin(coins);
        } catch (error) {
            throw error;
        }
    };

    handleConfirmation = async (coinData, isEdit = false, isApply = false, isPresetAsset = false) => {
        const {
            // coins,
            exchange, isConfigure, selectedAsset } = this.state;
        if (isEdit) {
            try {
                // if (!coinData.logo || selectedAsset.logo) {
                //     coinData.logo = ''
                // }
                delete coinData.key;
                delete coinData.value;
                delete coinData.iconName;
                if (coinData.symbol) {
                    coinData.symbol = coinData.symbol.toLowerCase();
                }
                // if (!coinData.network) coinData.network = '';
                // if (!coinData.standard) coinData.standard = '';
                // if (!coinData.estimated_price) {
                //     coinData.estimated_price = 1;
                // }
                if (!coinData.fullname) coinData.fullname = selectedAsset.fullname;
                if (!coinData.symbol) coinData.symbol = selectedAsset.symbol;
                if (!coinData.min) coinData.min = selectedAsset.min;
                if (!coinData.max) coinData.max = selectedAsset.max;
                if (!coinData.increment_unit) coinData.increment_unit = selectedAsset.increment_unit;
                // await updateAssetCoins(coinData);
                // await this.getCoins();
                if (isApply) {
                    await this.handleApply();
                }
                message.success('Assets updated successfully');
                this.handleClose();
                if (isConfigure) {
                    this.setState({ isConfigure: false, isPreview: true, formData: {} })
                }
            } catch (error) {
                if (error && error.data) {
                    message.error(error.data.message)
                }
            }
        } else {
            try {
                if (!coinData.logo) {
                    coinData.logo = ''
                }
                delete coinData.key;
                delete coinData.value;
                delete coinData.iconName;
                delete coinData.code;
                if (coinData.symbol) {
                    coinData.symbol = coinData.symbol.toLowerCase();
                }
                // let pairs = exchange.pairs || [];
                // let coinList = coins.map(data => data.symbol);
                // let formProps = {
                //     id: exchange.id,
                //     pairs: pairs.map(data => data.name ? data.name : data.symbol),
                //     coins: [...coinList, coinData.symbol]
                // }
                if (!coinData.id) {
                    // const res = await updateAssetCoins(coinData);
                    const res = {};
                    this.props.addCoin(res.data);
                }
                // await putExchange(formProps);
                // await this.getExchange();
                // await this.getCoins();
                if (isPresetAsset && exchange.is_running) {
                    this.setState({ isPresetConfirm: true });
                }
                if (isApply) {
                    // await this.handleApply();
                }
                this.handleClose();
                message.success('Asset created successfully');
            } catch (error) {
                if (error && error.data) {
                    message.error(error.data.message)
                }
            }
        }
    };

    handleDelete = async (symbol) => {
        // const { coins, exchange } = this.state;
        try {
            // let formProps = {
            //     id: exchange.id,
            //     coins: coins.filter(data => data.symbol !== symbol).map(data => data.symbol),
            //     pairs: exchange.pairs.filter(data => {
            //         let tempPair = data.name ? data.name : data.symbol;
            //         let pairData = tempPair.split('-');
            //         return (pairData[0] !== symbol && pairData[1] !== symbol)
            //     }).map(data => data.name ? data.name : data.symbol)
            // };
            // await putExchange(formProps);
            // await this.getExchange();
            // await this.getCoins();
            message.success('Asset removed successfully');
            this.setState({ isConfigure: false, isPreview: false });
            this.props.handleHide(false);
        } catch (error) {
            if (error && error.data) {
                message.error(error.data.message)
            }
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
        this.setState({
            isPreview: true,
            selectedAsset: asset,
        });
    };

    handleAssetBreadcrumb = (asset) => {
        this.setState({
            isPreview: false,
            isConfigure: false
        });
    };

    handleConfigure = () => {
        this.setState({ isConfigure: true, isPreview: false });
    };

    handleFilterValues = (filterValues) => {
        this.setState({ filterValues })
    }

    onClickFilter = () => {
        const { filterValues, exchange } = this.state;
        const lowercasedValue = filterValues.toLowerCase();
        let result = exchange.coins.filter(list => {
            return list.symbol.toLowerCase().includes(lowercasedValue) ||
                list.fullname.toLowerCase().includes(lowercasedValue)
        });
        this.setState({ coins: result })
    }

    handleEditData = (data) => {
        this.setState({ selectedAsset: data });
    };

    renderBreadcrumb = () => {
        return (
            <div>
                {this.state.isPreview || this.state.isConfigure
                    ?
                    <Breadcrumb>
                        <Item onClick={this.handleAssetBreadcrumb}>Assets</Item>
                        <Item className={this.state.isPreview || this.state.isConfigure ? "breadcrumb_active" : ""}>Manage asset</Item>
                    </Breadcrumb>
                    : null
                }
            </div>
        )
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
            editConfigureScreen: key
        });
    };

    renderPreview = () => {
        const { user } = this.props;
        if (this.state.isConfigure) {
            return (
                <div className="overview-wrap">
                    <div className="preview-container">
                        {this.renderBreadcrumb()}
                        <FinalPreview
                            isConfigure
                            coinFormData={this.state.selectedAsset}
                            user={user}
                            setConfigEdit={this.handleConfigureEdit}
                            handleFileChange={this.handleFileChange}
                            handleDelete={this.handleDelete}
                        />
                    </div>
                    <div>
                        <Button
                            type="primary"
                            className="configure-btn green-btn"
                            onClick={this.applyConfirmation}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            );
        } else if (this.state.isPreview) {
            return (
                <div className="overview-wrap">
                    <div className="preview-container">
                        {this.renderBreadcrumb()}
                        <FinalPreview
                            isPreview
                            coinFormData={this.state.selectedAsset}
                            user={user}
                            handleEdit={this.handleEdit}
                            handleDelete={this.handleDelete}
                            setConfigEdit={this.handleConfigureEdit}
                            exchangeUsers={this.state.exchangeUsers}
                            userEmails={this.state.userEmails}
                        />
                    </div>
                    {this.state.selectedAsset.created_by === user.id
                        ? <div>
                            <div className="d-flex">
                                <Button
                                    type='primary'
                                    className="green-btn"
                                    onClick={this.handleConfigure}
                                >
                                    Configure
                                </Button>
                                <div className="separator"></div>
                                {this.state.selectedAsset.verified
                                    ? (<Fragment>
                                        <Button className="green-btn" type="primary" onClick={() => this.handleConfigureEdit('mint')}>
                                            Mint
                                        </Button>
                                        <div className="separator"></div>
                                        <Button className="green-btn" type="primary" onClick={() => this.handleConfigureEdit('burn')}>
                                            Burn
                                        </Button>
                                    </Fragment>)
                                    : null
                                }
                            </div>
                        </div>
                        : null
                    }
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
                message.error(error.data.message)
            }
        }
    };

    handleConfirmationClose = () => {
        this.setState({ isPresetConfirm: false });
    };

    handleFileChange = async (event, name) => {
        const file = event.target.files[0];
        if (file) {
            const base64Url = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
            const coinFormData = {
                ...this.state.selectedAsset,
                [name]: base64Url,
                iconName: file.name
            };
            this.handleEditData(coinFormData);
            this.updateFormData(name, base64Url)
        }
    };

    renderModalContent = () => {
        const {
            coins,
            isOpenAdd,
            isEdit,
            isConfigureEdit,
            editConfigureScreen,
            selectedAsset,
            isConfirm,
            exchangeUsers,
            userEmails
        } = this.state;
        if (isConfirm) {
            return (
                <div className="admin-asset-wrapper">
                    <div className="title">Apply changes to live exchange</div>
                    <div>Do you want to apply changes to the live website now?</div>
                    <div className="btn-wrapper">
                        <Button
                            type="primary"
                            className="apply-btn"
                            onClick={() => this.handleConfirmation(selectedAsset, true)}
                        >
                            Save without applying
                        </Button>
                        <div className="separator"></div>
                        <Button
                            type="primary"
                            className="apply-btn"
                            onClick={() => this.handleConfirmation(selectedAsset, true, true)}
                        >
                            Save and apply
                        </Button>
                    </div>
                </div>
            );
        } else if (isOpenAdd || isEdit || isConfigureEdit) {
            return (
                <CreateAsset
                    isEdit={isEdit}
                    editAsset={selectedAsset}
                    isConfigureEdit={isConfigureEdit}
                    editConfigureScreen={editConfigureScreen}
                    coins={coins}
                    handleEditDataCallback={this.handleEditData}
                    handleWidth={this.handleWidth}
                    handleConfirmation={this.handleConfirmation}
                    onClose={this.handleClose}
                    exchangeUsers={exchangeUsers}
                    userEmails={userEmails}
                    updateFormData={this.updateFormData}
                    getCoins={this.getCoins}
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
            exchangeBalance
        } = this.state;

        return (
            <div className="admin-asset-wrapper">
                {(isPreview || isConfigure)
                    ? this.renderPreview()
                    : <Fragment>
                        <div className="filter-header">
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
                                columns={
                                    getColumns(
                                        this.props.allCoins,
                                        this.props.user,
                                        exchangeBalance,
                                        this.handleEdit,
                                        this.handlePreview
                                    )
                                }
                                rowKey={(data, index) => index}
                                dataSource={coins}
                            />
                        </div>
                    </Fragment>
                }
                <Modal
                    visible={isOpenAdd || isEdit || isConfigureEdit || isConfirm || isPresetConfirm}
                    footer={null}
                    width={`${width}px`}
                    onCancel={this.handleClose}
                >
                    {this.renderModalContent()}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    allCoins: state.app.coins
});

export default connect(mapStateToProps)(Assets);
