import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { SortableContainer } from 'react-sortable-hoc';

import Tab from './Tab';
import AddTabList from './AddTabList';
import TabOverflowList from './TabOverflowList';
import { DEFAULT_TRADING_PAIRS, DEFAULT_COIN_DATA } from '../../config/constants';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

let timeOut = '';

const TabList = SortableContainer(({
     items,
     activeTabs,
     tickers,
     coins,
     selectedToOpen,
     selectedToRemove,
     activePairTab,
     onTabClick,
     onTabChange
    }) => (
    <div className="d-flex">
        {items.map((tab, index) => {
            const pair = activeTabs[tab];
            const ticker = tickers[tab];
                return (
                    <Tab
                        key={`item-${index}`}
                        index={index}
                        tab={tab}
                        pair={pair}
                        ticker={ticker}
                        coins={coins}
                        selectedToOpen={selectedToOpen}
                        selectedToRemove={selectedToRemove}
                        activePairTab={activePairTab}
                        sortId={index}
                        onTabClick={onTabClick}
                        onTabChange={onTabChange} />
                );
            })
        }
    </div>
));

class PairTabs extends Component {
    state = {
        selectedTabs: {},
        activeTabs: {},
        activeItems: [],
        activePairTab: '',
        isAddTab: false,
        selectedAddTab: '',
        isTabOverflow: false,
        searchValue: '',
        searchResult: {},
        selectedToRemove: '',
        selectedToOpen: ''
    };

    componentDidMount() {
        const { router, pairs, location } = this.props;
        let active = '';
        if (router && router.params.pair) {
            let tabs = localStorage.getItem('tabs');
            if (tabs !== null && tabs !== '' && !JSON.parse(tabs).length
                && location.pathname.indexOf('/trade/') === 0) {
                // this.setNoTabs();
            }
            active = router.params.pair;
            this.setState({ activePairTab: router.params.pair, selectedToOpen: router.params.pair });
        } else {
            active = '';
            this.setState({ activePairTab: '' });
        }
        this.initTabs(pairs, active);
    }

    componentWillReceiveProps(nextProps) {
        const { activePath, pairs, router, location } = nextProps;
        let active = this.state.activePairTab;
        let selectedToOpen = '';
        if (this.props.activePath !== activePath) {
            if (activePath !== 'trade') {
                active = "";
                this.setState({ activePairTab: '', selectedToOpen: '' });
            }
        }
        if (JSON.stringify(this.props.pairs) !== JSON.stringify(pairs)) {
            this.initTabs(pairs, active);
        }
        if (this.props.location && location
            && this.props.location.pathname !== location.pathname) {
            if (router && router.params.pair && location.pathname.indexOf('/trade/') === 0) {
                active = router.params.pair;
                if (!this.state.activeTabs[active]) {
                    selectedToOpen = active;
                }
                this.setState({ activePairTab: router.params.pair, selectedToOpen });
                let tabs = localStorage.getItem('tabs');
                if (tabs !== null &&
                    tabs !== '' &&
                    !JSON.parse(tabs).length) {
                    this.setNoTabs();
                }
            } else if (router && !router.params.pair) {
                active = "";
                this.setState({ activePairTab: '', selectedToOpen: '' });
            }
            this.initTabs(pairs, active);
        }
        if (this.props.activeLanguage !== nextProps.activeLanguage) {
            this.initTabs(pairs, active);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.tabCount !== prevProps.tabCount) {
            this.initTabs(this.props.pairs, this.state.activePairTab);
        }
        if (JSON.stringify(prevState.selectedTabs) !== JSON.stringify(this.state.selectedTabs)
            && !Object.keys(prevState.selectedTabs).length) {
            this.props.calculateTabs();
        }
    }

    componentWillUnmount() {
        if (timeOut) {
            clearTimeout(timeOut);
        }
    }

    initTabs = (pairs, activePair) => {
        let tabs = localStorage.getItem('tabs');
        if (tabs === null || tabs === '') {
            tabs = DEFAULT_TRADING_PAIRS;
        } else if (tabs) {
            tabs = JSON.parse(tabs);
        } else {
            tabs = [];
        }
        if (Object.keys(pairs).length) {
            const tempTabs = {};
            const selected = {};
            if (activePair && !Object.keys(pairs).filter(value => value === activePair).length) {
                this.props.router.push('/trade/add/tabs');
            }
            tabs.map((key, index) => {
                if (pairs[key]) {
                    if (index <= this.props.tabCount - 1)
                        tempTabs[key] = pairs[key];
                    selected[key] = pairs[key];
                }
                return key;
            });
            if (activePair && !tempTabs[activePair]) {
                const temp = pairs[activePair];
                const pairKeys = Object.keys(tempTabs);
                if (pairKeys.length < this.props.tabCount) {
                    tempTabs[activePair] = temp;
                } else {
                    delete tempTabs[pairKeys[pairKeys.length - 1]];
                    tempTabs[activePair] = temp;
                }
                if (!selected[activePair]) {
                    selected[activePair] = temp;
                }
            }
            this.setState({
                selectedTabs: selected,
                activeTabs: tempTabs,
                activeItems: Object.keys(tempTabs)
            });
            this.setTabsLocal(selected);
        }
    };

    onTabClick = pair => {
        if (pair) {
            this.props.router.push(`/trade/${pair}`);
            this.setState({ activePairTab: pair });
        }
    };

    openAddTabMenu = e => {
        this.setState({ isAddTab: !this.state.isAddTab, isTabOverflow: false });
    };

    onAddTabClick = pair => {
        this.setState({ selectedAddTab: pair });
    };

    onTabChange = pair => {
        const { selectedTabs, activeTabs, activePairTab, selectedToOpen } = this.state;
        const { activePath, pairs } = this.props;
        let localTabs = {};
        let tabPairs = [];
        if (selectedTabs[pair]) {
            localTabs = { ...selectedTabs };
            tabPairs = Object.keys(localTabs);
            delete localTabs[pair];
            this.setTabsLocal(localTabs);
            if (activePairTab === pair || activePath !== 'trade') {
                let index = tabPairs.indexOf(pair);
                let tabValue = '';
                if (index < (tabPairs.length - 1)) {
                    tabValue = tabPairs[index + 1];
                } else {
                    tabValue = tabPairs[index - 1];
                }
                timeOut = setTimeout(() => {
                    this.onTabClick(tabValue);
                }, 300);
            }
            tabPairs = Object.keys(localTabs);
            this.setState({ selectedTabs: { ...localTabs }, selectedToRemove: pair, selectedToOpen: '' });
        } else {
            const temp = pairs[pair];
            if (temp && temp.pair_base) {
                localTabs = { ...selectedTabs, [pair]: temp };
                tabPairs = Object.keys(localTabs);
                this.setState({ selectedTabs: { ...localTabs }, selectedToOpen: pair, selectedToRemove: '' });
            }
            this.setTabsLocal(localTabs);
            this.onTabClick(pair);
        }
        if (activeTabs[pair]) {
            let tempActive = {};
            tabPairs.map((key, index) => {
                if (index <= this.props.tabCount - 1) {
                    tempActive = { ...tempActive, [key]: localTabs[key] };
                }
                return key;
            });
            timeOut = setTimeout(() => {
                this.setState({
                    activeTabs: { ...tempActive },
                    activeItems: Object.keys(tempActive)
                });
            }, 300);
        } else if (!activeTabs[pair] && localTabs[pair]) {
            let tempActive = activeTabs;
            let activeKeys = Object.keys(activeTabs);
            timeOut = setTimeout(() => {
                if (tabPairs.length <= this.props.tabCount) {
                    this.setState({
                        activeTabs: { ...localTabs },
                        activeItems: Object.keys(localTabs)
                    });
                } else {
                    delete tempActive[activeKeys[activeKeys.length - 1]];
                    tempActive[pair] = localTabs[pair];
                    this.setState({
                        activeTabs: { ...tempActive },
                        activeItems: Object.keys(tempActive)
                    });
                }
            }, 300);
        }
        if (!tabPairs.length) {
            this.setNoTabs()
        }
        if (activeTabs[pair]
            && pair !== activePairTab
            && selectedToOpen === activePairTab) {
            this.setState({ selectedToOpen: '' });
        }
        // this.setTabsLocal(localTabs);
        this.closeAddTabMenu();
    };

    onOverflowClick = () => {
        this.setState({ isTabOverflow: !this.state.isTabOverflow, isAddTab: false });
    };

    handleOverflow = pair => {
        const { selectedTabs, activeTabs } = this.state;
        if (!activeTabs[pair]) {
            const tempTabs = { [pair]: selectedTabs[pair], ...activeTabs };
            const pairs = Object.keys(tempTabs);
            delete tempTabs[pairs[pairs.length - 1]];
            this.setState({
                activeTabs: { ...tempTabs },
                selectedTabs: { ...tempTabs, ...this.state.selectedTabs }
            });
            this.setTabsLocal({ ...tempTabs, ...this.state.selectedTabs });
        }
        this.onTabClick(pair);
        this.closeOverflowMenu();
    };

    closeAddTabMenu = () => {
        this.setState({ isAddTab: false, searchValue: '', searchResult: {} });
    };

    closeOverflowMenu = () => {
        this.setState({ isTabOverflow: false });
    };

    handleSearch = (_, value) => {
        const { pairs, coins } = this.props;
        if (value) {
            let result = {};
            let searchValue = value.toLowerCase().trim();
            Object.keys(pairs).map(key => {
                let temp = pairs[key];
                const { fullname } = coins[temp.pair_base.toLowerCase()] || DEFAULT_COIN_DATA;
                let cashName = fullname ? fullname.toLowerCase() : '';
                if (key.indexOf(searchValue) !== -1 ||
                    temp.pair_base.indexOf(searchValue) !== -1 ||
                    temp.pair_2.indexOf(searchValue) !== -1 ||
                    cashName.indexOf(searchValue) !== -1) {
                        result[key] = temp;
                }
                return key;
            });
            this.setState({ searchResult: { ...result }, searchValue: value });
        } else {
            this.setState({ searchResult: {}, searchValue: '' });
        }
    };

    setTabsLocal = tabs => {
        localStorage.setItem('tabs', JSON.stringify(Object.keys(tabs)));
    };

    setNoTabs = () => {
        this.props.router.push('/account');
    };

    onSortEnd = ({oldIndex, newIndex}) => {
        const startIndex = newIndex < 0 ? this.state.activeItems.length + newIndex : newIndex;
        const pairTemp = this.state.activeItems.filter((data, index) => index !== oldIndex);
        pairTemp.splice(startIndex, 0, this.state.activeItems[oldIndex]);
        const sortedTabs = {};
        pairTemp.forEach(data => {
            sortedTabs[data] = this.state.selectedTabs[data];
        });
        this.setTabsLocal({ ...sortedTabs, ...this.state.selectedTabs });
        this.setState({
            activeItems: pairTemp,
            activeTabs: { ...sortedTabs },
            selectedTabs: { ...sortedTabs, ...this.state.selectedTabs }
        });
    };

    render() {
        const {
            selectedTabs,
            isAddTab,
            selectedAddTab,
            activePairTab,
            isTabOverflow,
            activeTabs,
            searchValue,
            searchResult,
            selectedToOpen,
            selectedToRemove
        } = this.state;
        const { pairs, tickers, location, coins, tabCount } = this.props;
        const obj = {};
        Object.entries(pairs).forEach(([key, pair]) => {
            obj[pair.pair_2] = '';
        });
        const symbols = Object.keys(obj).map((key) => key);
        
        return (
            <div className="d-flex h-100">
                <TabList
                    axis={'x'}
                    pressDelay={200}
                    items={this.state.activeItems}
                    onSortEnd={this.onSortEnd}
                    activeTabs={activeTabs}
                    tickers={tickers}
                    coins={coins}
                    selectedToOpen={selectedToOpen}
                    selectedToRemove={selectedToRemove}
                    activePairTab={activePairTab}
                    onTabClick={this.onTabClick}
                    onTabChange={this.onTabChange} />
                <div className={
                    classnames(
                        'app_bar-pair-content',
                        'd-flex',
                        'justify-content-between',
                        'px-2',
                        {
                            'active-tab-pair': isAddTab || (location.pathname === '/trade/add/tabs' && !Object.keys(selectedTabs).length)
                        })
                    }>
                    <div onClick={this.openAddTabMenu}>
                        <ReactSVG path={ICONS.TAB_PLUS} wrapperClassName="app-bar-tab-close" />
                    </div>
                    {Object.keys(selectedTabs).length <= 0 ?
                        <span onClick={this.openAddTabMenu}>{STRINGS.ADD_TRADING_PAIR}</span>
                    : '' }
                    {isAddTab &&
                        <AddTabList
                            symbols={symbols}
                            pairs={pairs}
                            tickers={tickers}
                            coins={coins}
                            selectedTabs={selectedTabs}
                            activeTabs={activeTabs}
                            selectedTabMenu={selectedAddTab || symbols[0]}
                            searchValue={searchValue}
                            searchResult={searchResult}
                            onAddTabClick={this.onAddTabClick}
                            onTabChange={this.onTabChange}
                            closeAddTabMenu={this.closeAddTabMenu}
                            handleSearch={this.handleSearch}
                        />
                    }
                </div>
                {Object.keys(selectedTabs).length > tabCount
                    && <div
                        className={classnames('app_bar-pair-overflow', 'd-flex', 'align-items-center', { 'active-tab-overflow': isTabOverflow })}>
                        <div onClick={this.onOverflowClick}>
                            <ReactSVG path={ICONS.DOUBLE_ARROW} wrapperClassName="app-bar-tab-close" />
                        </div>
                    {isTabOverflow
                        && <TabOverflowList
                            activeTabs={activeTabs}
                            activePairTab={activePairTab}
                            selectedTabs={selectedTabs}
                            tickers={tickers}
                            coins={coins}
                            handleOverflow={this.handleOverflow}
                            closeOverflowMenu={this.closeOverflowMenu}
                        />
                    }
                </div>}
            </div>
        );
    }
}

const mapStateToProps = store => ({
    activeLanguage: store.app.language,
    pairs: store.app.pairs,
    tickers: store.app.tickers,
    coins: store.app.coins
});

export default connect(mapStateToProps)(PairTabs);