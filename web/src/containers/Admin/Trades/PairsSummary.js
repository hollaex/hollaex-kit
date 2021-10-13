import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Spin, Table } from 'antd';
import { CloseOutlined, MinusCircleFilled } from '@ant-design/icons';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import Coins from '../Coins';
import IconToolTip from '../IconToolTip';
import Filter from '../FilterComponent';
import { setAllPairs, setCoins } from 'actions/assetActions';
import { STATIC_ICONS } from 'config/icons';

const filterOptions = [
    {
        label: 'All',
        value: 'all',
        secondaryType: 'text',
        secondaryPlaceHolder: 'Input name or symbol',
    },
];

const COLUMNS = (pairs, allCoins = [], user = {}, constants = {}) => {
    const columnData = [
        {
            title: 'Markets',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol, { fullname = '', verified, basename, name, ...rest }) => {
                const pairData = symbol ? symbol.split('-') : name.split('-');
                let pair_base = pairData.length ? pairData[0] : '';
                let pair_2 = pairData.length ? pairData[1] : '';
                const pair_base_data =
                    allCoins.filter((data) => data.symbol === pair_base)[0] || {};
                const pair2_data =
                    allCoins.filter((data) => data.symbol === pair_2)[0] || {};
                return (
                    <div
                        className="coin-symbol-wrapper"
                    >
                        <div className="coin-title">{pair_base_data.fullname}</div>
                        <div className="config-content content-space2">
                            <Coins
                                color={pair_base_data.meta ? pair_base_data.meta.color : ''}
                                type={pair_base.toLowerCase()}
                                small={true}
                            />
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
                        </div>
                        <span className="content-space2">{pair2_data.fullname}</span>
                    </div>
                );
            },
        },
    ];
    let children = [];
    let data = [
        {
            title: 'Pro Trade',
            isActive: constants.features && constants.features.pro_trade
        },
        {
            title: 'Quick Trade',
            isActive: constants.features && constants.features.quick_trade
        }
    ]
    data.forEach((item) => {
        children.push({
            title: (
                <div>
                    <div>{item.title}</div>
                </div>
            ),
            dataIndex: 'orderBook',
            className: 'type-column',
            render: () => (
                <div>
                    {item.isActive
                        ? <div className="active-status">
                            <img
                                src={STATIC_ICONS.VERIFICATION_VERIFIED}
                                className="active-status-icon"
                                alt="active_icon"
                            />
                            <div>Active</div>
                        </div>
                        : <div className="active-status">
                            <MinusCircleFilled style={{ color: '#808080', marginRight: '5px' }} />
                            <div>Inactive</div>
                        </div>
                    }
                </div>
            ),
        });
    });
    columnData.push({
        title: <div>Orderbook (<Link to="/admin/trade?tab=1&isViewTabs=true">View</Link>)</div>,
        children,
    });
    return columnData;
};

class PairsSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterValues: '',
            pairs: [],
            isHovered: false,
            hoveredKey: 0,
        };
    }

    componentDidMount() {
        if (this.props.pairs.length &&
            this.props.allPairs.length) {
            const pairs = this.props.allPairs.filter(data => this.props.pairs.includes(data.name));
            this.setState({
                pairs,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if ((JSON.stringify(this.props.allPairs) !== JSON.stringify(prevProps.allPairs)) ||
            (JSON.stringify(this.props.pairs) !== JSON.stringify(prevProps.pairs))) {
            let pairs = this.props.allPairs.filter((data) =>
                this.props.pairs.includes(data.name)
            );
            this.setState({
                pairs,
            });
        }
    }

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

    handleHover = (hoveredKey) => {
        this.setState(prevState => ({ isHovered: !prevState.isHovered, hoveredKey }));
    }

    renderContent = (allCoins, pendingPairs, configurePairs) => {
        return (
            <div>
                {configurePairs.length
                    ?
                    <div>
                        {configurePairs.map((item, key) => {
                            const pairs = item.split('-');
                            const pair_base_fullname =
                                allCoins.filter((data) => data.symbol === pairs[0])[0].fullname || '';
                            const pair2_fullname =
                                allCoins.filter((data) => data.symbol === pairs[1])[0].fullname || '';
                            return <div
                                className="box-content"
                                onMouseEnter={() => this.handleHover(key)}
                                onMouseLeave={() => this.handleHover(key)}
                            >
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <Link to={`/admin/trade?tab=1&isViewTabs=true&isOpenPairModal=true&pairs=${pairs[0]}-${pairs[1]}`}>
                                            <IconToolTip
                                                type="settings"
                                                tip="Click to complete the market configuration"
                                            />
                                        </Link>
                                        <div className="ml-4">{pair_base_fullname}/{pair2_fullname}</div>
                                        <div className="ml-2 grey-text">({pairs[0]}/{pairs[1]})</div>
                                    </div>
                                    <div className="text-end">
                                        <div>(<Link to={`/admin/trade?tab=1&isViewTabs=true&isOpenPairModal=true&pairs=${pairs[0]}-${pairs[1]}`} className="text-underline">Configure</Link>)</div>
                                        {this.state.isHovered && (this.state.hoveredKey === key)
                                            ? <div className="small-txt">Click to complete configuration</div>
                                            : <div className="small-txt">Configuration incomplete</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                    : null
                }
                {pendingPairs.length
                    ?
                    <div>
                        {pendingPairs.map((item, key) => {
                            const pair_base_fullname =
                                allCoins.filter((data) => data.symbol === item.pair_base)[0].fullname || '';
                            const pair2_fullname =
                                allCoins.filter((data) => data.symbol === item.pair_2)[0].fullname || '';
                            return <div className="box-content">
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <Link to="/admin/trade?tab=1&isViewTabs=true">
                                            <IconToolTip
                                                type="warning"
                                                tip="This market is in pending verification"
                                            />
                                        </Link>
                                        <div className="ml-4">{pair_base_fullname}/{pair2_fullname}</div>
                                        <div className="ml-2 grey-text">({item.pair_base}/{item.pair_2})</div>
                                    </div>
                                    <div className="text-end">
                                        <div>(<Link to="/admin/trade?tab=1&isViewTabs=true" className="text-underline">View</Link>)</div>
                                        <div className="orange-text small-txt">pending...</div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                    : null
                }
            </div>
        )
    }

    render() {
        const { allCoins, allPairs, user, pairs = [], constants } = this.props;
        let allPairSymbols = allPairs.map(item => item.code);
        let configurePairs = pairs.filter(data => !allPairSymbols.includes(data));
        const pendingPairs = allPairs && allPairs.filter(data => pairs.includes(data.name) && !data.verified);
        if (this.state.pairs.length === 0 && pendingPairs.length === 0) {
            return <Spin size="large" className="m-top" />;
        }
        return (
            <div className="admin-pairs-container">
                <Fragment>
                    <div className="orderbook-content mb-4">
                        <div className="title">Pending markets</div>
                        <div>Below is a list of markets that are incomplete and/or pending verification. Complete your market configurations to activate</div>
                        <div className="box-container">
                            {pendingPairs.length || configurePairs.length
                                ?
                                <div>
                                    {this.renderContent(allCoins, pendingPairs, configurePairs)}
                                </div>
                                :
                                <div className="no-markets">
                                    <div>No pending markets detected</div>
                                </div>
                            }
                        </div>
                    </div>
                    <div>A list of all active markets</div>
                    <div className="filter-header">
                        <Filter
                            selectOptions={filterOptions}
                            onChange={this.handleFilterValues}
                            onClickFilter={this.onClickFilter}
                        />
                    </div>
                    <div className="summary table-wrapper">
                        <Table
                            columns={COLUMNS(allPairs, allCoins, user, constants)}
                            rowKey={(data, index) => index}
                            dataSource={this.state.pairs}
                            bordered
                        />
                    </div>
                </Fragment>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        exchange: state.asset && state.asset.exchange ? state.asset.exchange : {},
        pairs:
            (state.asset && state.asset.exchange && state.asset.exchange.pairs) || [],
        allPairs: state.asset.allPairs.length ? state.asset.allPairs : [],
        user: state.user,
        allCoins: state.asset.allCoins.length ? state.asset.allCoins : [],
        constants: state.app.constants,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setCoins: bindActionCreators(setCoins, dispatch),
    setAllPairs: bindActionCreators(setAllPairs, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PairsSummary);
