import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, Table, Modal, Breadcrumb, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import CreatePair from '../CreatePair';
import Preview from '../CreatePair/Preview';
// import ApplyChangesConfirmation from '../../components/ApplyChangesConfirmation';
// import { ExchangeAction, PairAction } from '../../actions';
// import { getTabParams } from '../../common/utils';
// import { storePairs, putExchange, getExchange, updatePair, requestApplyOnKit } from '../../common/fetch';
import { Filters } from './Filters';
import Coins from '../Coins';
import IconToolTip from '../IconToolTip';
import { getTabParams } from '../AdminFinancials/Assets';

const { Item } = Breadcrumb;

export const renderStatus = ({ id, verified, created_by }, user) => {
    if (created_by !== user.id) {
        return null;
    }
    return (
        <div className="settings-toolTip coin-config-align">
            {(!id && !verified)
                ? 
                <Link to='/admin/financials?tab=1'>
                    <IconToolTip
                        type="settings"
                        tip="Click to complete the asset configuration"
                    />
                </Link>
                : (!verified)
                    ? (
                        <Link to='/admin/financials?tab=1'>
                            <IconToolTip
                                type="warning"
                                tip="This asset is in pending verification"
                            />
                        </Link>
                    )
                    : null
            }
        </div>
    );
};

// const filterOptions = [
//     { label: 'All', value: 'all', secondaryType: 'text', secondaryPlaceHolder: 'Input name or symbol' }
// ];
const COLUMNS = (pairs, allCoins = [], user = {}, handlePreview) => [
    {
        title: 'Pairs',
        dataIndex: 'symbol',
        key: 'symbol',
        render: (symbol, { fullname = '', verified, basename, name, ...rest }) => {
            const pairData = symbol ? symbol.split('-') : name.split('-');
            let pair_base = pairData.length ? pairData[0] : "";
            let pair_2 = pairData.length ? pairData[1] : "";
            const pair_base_data = allCoins.filter((data) => data.symbol === pair_base)[0] || {};
            const pair2_data = allCoins.filter((data) => data.symbol === pair_2)[0] || {};
            let filterPair = pairs.filter((pair) => pair.code === rest.code)[0] || {};
            return (
                <div
                    className="coin-symbol-wrapper"
                    onClick={
                        () => handlePreview(
                            {
                                ...filterPair,
                                verified,
                                pair_base,
                                pair_2,
                                pair_base_data,
                                pair2_data
                            }
                        )
                    }
                >
                    <div className="coin-title pairs">
                        {pair_base_data.fullname}
                    </div>
                    <div className="config-content content-space2">
                        <Coins
                            color={
                                pair_base_data.meta
                                    ? pair_base_data.meta.color
                                    : ''
                            }
                            type={pair_base.toLowerCase()}
                            small={true}
                        />
                        <div className="icon-wrapper">
                            {renderStatus(pair_base_data, user)}
                        </div>
                    </div>
                    <div className="content-space1">
                        <CloseOutlined />
                    </div>
                    <div className="config-content content-space1">
                        <Coins
                            color={
                                pair2_data.meta
                                    ? pair2_data.meta.color
                                    : ''
                            }
                            type={pair_2.toLowerCase()}
                            small={true}
                        />
                        <div className="icon-wrapper">
                            {renderStatus(pair2_data, user)}
                        </div>
                    </div>
                    <span className="content-space2 pairs">{pair2_data.fullname}</span>
                    {verified
                        ? <IconToolTip type="success" tip="" animation={false} />
                        : <IconToolTip type="warning" tip="This asset is in pending verification" />
                    }
                </div>
            );
        }
    }
];

class Pairs extends Component {
    constructor(props) {
        super(props)
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
            isPresetConfirm: false
        }
    }

    componentDidMount() {
        if (this.props.pairs && this.props.pairs.length) {
            this.setState({
                pairs: this.props.pairs
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.pairs) !== JSON.stringify(prevProps.pairs)) {
            this.setState({
                pairs: this.props.pairs
            });
        }
        if (JSON.stringify(this.props.location) !== JSON.stringify(prevProps.location)) {
            const tabParams = getTabParams();
            if (tabParams.tab === '0') {
                this.props.handleHide(false);
                this.setState({
                    isPreview: false,
                    isConfigure: false
                });
            }
        }
    }

    getExchange = async () => {
        try {
            // const res = await getExchange();
            // const exchange = res.data.data.sort((a, b) => {
            //     const ad = new Date(a.updated_at);
            //     const bd = new Date(a.updated_at);
            //     if (Math.floor(ad - bd) >= 0) {
            //         return a - b;
            //     } else {
            //         return b - a;
            //     }
            // });

        } catch (error) {
            if (error && error.data) {
                message.error(error.data.message)
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
            isConfirm: false
        });
    };

    handleWidth = (width) => {
        this.setState({ width: width ? width : 520 });
    };

    handlePreview = (data = {}) => {
        let previewPairData = {
            ...data,
            estimated_price: data.estimated_price === null
                ? 1 : data.estimated_price
        }
        this.props.handleHide(!this.state.isPreview);
        this.setState({
            isPreview: !this.state.isPreview,
            isConfigure: false,
            previewData: previewPairData
        });
    };

    handleConfigure = () => {
        this.props.handleHide(true);
        this.setState({ isConfigure: true, isPreview: false });
    };

    handleEdit = () => {
        this.setState({ isEdit: true, step: 'step2' });
    };

    handleFilterValues = (filterValues) => {
        this.setState({ filterValues })
    };

    onClickFilter = () => {
        const { filterValues } = this.state;
        const { pairs } = this.props;
        const lowercasedValue = filterValues.toLowerCase();
        if (lowercasedValue) {
            let result = pairs.filter((list = {}) => {
                return (
                    (list.name && list.name.toLowerCase().includes(lowercasedValue)) ||
                    (list.pair_2 && list.pair_2.toLowerCase().includes(lowercasedValue)) ||
                    (list.pair_base && list.pair_base.toLowerCase().includes(lowercasedValue))
                )
            });
            this.setState({ pairs: result })
        } else {
            this.setState({ pairs })
        }
    }

    getTradingPairs = async () => {
        // const { pairAction } = this.props;
        try {
            // const res = await getPairs();
            const res = {};
            if (res.data && res.data.data) {
                // pairAction.setPair(res.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    handleDelete = async (formData) => {
        // const { pairs = [], exchange = {} } = this.props;
        try {
            // let coins = exchange.coins || [];
            // let pairList = pairs.map(data => data.name ? data.name : data.symbol);

            // let formProps = {
            //     id: exchange.id,
            //     // coins: coins.map(data => data.symbol),
            //     pairs: pairList.filter((data) => data !== `${formData.pair_base}-${formData.pair_2}`)
            // }
            // await putExchange(formProps);
            // await this.getExchange();
            // await this.getTradingPairs();
            message.success('Pair removed successfully');
            this.setState({ isPreview: false, isConfigure: false });
            this.props.handleHide(false);
        } catch (error) {
            if (error && error.data) {
                message.error(error.data.message)
            }
        }
    };

    handleApply = async () => {
        try {
            // await requestApplyOnKit(this.props.exchange.id);
            this.handleApplyClose();
        } catch (error) {
            if (error && error.data) {
                message.error(error.data.message)
            }
        }
    };

    handleApplyOpen = () => {
        this.setState({ isPresetConfirm: true });
    };

    handleApplyClose = () => {
        this.setState({ isPresetConfirm: false });
    };

    handleConfirm = async (formData, isEdit = false, isApply = false, isPresetAsset = false) => {
        if (isEdit) {
            try {
                delete formData.pair_base_data;
                delete formData.pair2_data;
                if (!formData.name) {
                    formData.name = `${formData.pair_base}-${formData.pair_2}`;
                }
                // await updatePair(formData);
                // await this.getExchange();
                // await this.getTradingPairs();
                if (isApply) {
                    await this.handleApply();
                }
                message.success('Pairs updated successfully');
                this.handleClose();
                if (this.state.isConfigure) {
                    this.setState({ isPreview: true })
                }
            } catch (error) {
                if (error && error.data) {
                    message.error(error.data.message)
                }
            }
        } else {
            const { pairs = [], exchange = {} } = this.props;
            try {
                if (!formData.name) {
                    formData.name = `${formData.pair_base}-${formData.pair_2}`;
                }
                // let coins = exchange.coins || [];
                let pairList = pairs.map(data => data.name ? data.name : data.symbol);

                if (!this.props.allPairs.filter(data => data.name === formData.name).length) {
                    // await storePairs(formData);
                }

                if (pairList.includes(formData.name)) {
                    message.warning('Pairs already exists')
                } else {
                    // let formProps = {
                    //     id: exchange.id,
                    //     coins: coins.map(data => data.symbol),
                    //     pairs: [...pairList, `${formData.pair_base}-${formData.pair_2}`]
                    // }
                    // await putExchange(formProps);
                    // await this.getExchange();
                    // await this.getTradingPairs();
                    if (isPresetAsset && exchange.is_running) {
                        this.handleApplyOpen();
                    }
                    if (isApply) {
                        await this.handleApply();
                    }
                    this.handleClose();
                    message.success('Pairs created successfully');
                }
            } catch (error) {
                if (error && error.data) {
                    message.error(error.data.message)
                }
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
            this.handleConfirm(this.state.previewData, true)
        }
    };

    renderBreadcrumb = () => {
        return (
            <div>
                {this.state.isPreview || this.state.isConfigure
                    ?
                    <Breadcrumb>
                        <Item><Link to="/admin/trade?tab=0">Pairs</Link></Item>
                        <Item className={this.state.isPreview || this.state.isConfigure ? "breadcrumb_active" : ""}>Manage pair</Item>
                    </Breadcrumb>
                    : null
                }
            </div>
        )
    };

    renderContent = () => {
        const { coins, allCoins, allPairs, user } = this.props;
        if (this.state.isPreview) {
            return (<div className="preview-container">
                {this.renderBreadcrumb()}
                <div className="d-flex justify-content-between flex-column-rev">
                    <Preview
                        coins={coins}
                        allCoins={allCoins}
                        isPreview={this.state.isPreview}
                        formData={this.state.previewData}
                        onEdit={this.handleEdit}
                        onDelete={this.handleDelete}
                    />
                    <div>
                        {(this.state.previewData.created_by === user.id)
                            ? 
                            <Button type="primary" className="configure-btn" onClick={this.handleConfigure}>Configure</Button>
                            : null
                        }
                    </div>
                </div>
            </div>);
        } else if (this.state.isConfigure) {
            return (
                <div className="preview-container">
                    {this.renderBreadcrumb()}
                    <div className="d-flex justify-content-between flex-column-rev">
                        <Preview
                            coins={coins}
                            allCoins={allCoins}
                            user={user}
                            isConfigure={this.state.isConfigure}
                            formData={this.state.previewData}
                            onEdit={this.handleEdit}
                            onDelete={this.handleDelete}
                        />
                        <div>
                            <Button
                                type="primary"
                                className="configure-btn"
                                onClick={this.handleApplyConfirmation}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <Fragment>
                    <div className="filter-header">
                        <Filters />
                        <Button
                            type="primary"
                            className="green-btn"
                            onClick={this.handleCreateNew}
                        >
                            Create/add pair
                        </Button>
                    </div>
                    <div className="table-wrapper">
                        <Table
                            columns={COLUMNS(allPairs, allCoins, user, this.handlePreview)}
                            rowKey={(data, index) => index}
                            dataSource={this.state.pairs}
                        />
                    </div>
                </Fragment>
            );
        }
    };

    renderModalContent = () => {
        const {
            isConfirm,
            isOpen,
            isEdit,
            step,
            previewData
        } = this.state;
        if (isConfirm) {
            return (
                <div className="preview-container">
                    <div className="title">Apply changes to live exchange</div>
                    <div>Do you want to apply changes to the live website now?</div>
                    <div className="btn-wrapper">
                        <Button
                            type="primary"
                            onClick={() => this.handleConfirm(previewData, true)}
                        >
                            Save without applying
                        </Button>
                        <div className="separator"></div>
                        <Button
                            type="primary"
                            onClick={() => this.handleConfirm(previewData, true, true)}
                        >
                            Save and apply
                        </Button>
                    </div>
                </div>
            )
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
                />
            )
        }
    };

    render() {
        const {
            isConfirm,
            width,
            isOpen,
            isEdit,
            // isPresetConfirm
        } = this.state;
        return (
            <div className="admin-pairs-container">
                {this.renderContent()}
                <Modal
                    width={`${width}px`}
                    visible={isOpen || isEdit || isConfirm}
                    onCancel={this.handleClose}
                    footer={null}
                >
                    {this.renderModalContent()}
                </Modal>
                {/* <ApplyChangesConfirmation
                    isVisible={isPresetConfirm}
                    handleApply={this.handleApply}
                    handleClose={this.handleApplyClose}
                /> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    let exchange = {};
    if (state.exchange && state.exchange.length) {
        exchange = state.exchange[0]
    }
    return {
        exchange,
        // coins: exchange.coins || [],
        // pairs: exchange.pairs || [],
        // allPairs: state.pair,
        user: state.user,
        // allCoins: state.coin
    }
};

export default connect(mapStateToProps)(Pairs);
