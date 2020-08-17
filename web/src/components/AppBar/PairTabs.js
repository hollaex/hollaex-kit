import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { SortableContainer } from 'react-sortable-hoc';

import Tab from './Tab';
import AddTabList from './AddTabList';
import { DEFAULT_TRADING_PAIRS, DEFAULT_COIN_DATA } from 'config/constants';
import { ICONS } from 'config/constants';
import STRINGS from 'config/localizedStrings';

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
            this.setState({ activePairTab: active, selectedToOpen: active });
        } else {
            active = '';
            this.setState({ activePairTab: '' });
        }
        this.initTabs(pairs, active);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { activePath, pairs, router, location } = nextProps;
        let active = this.state.activePairTab;
        let selectedToOpen = '';
        if (this.props.activePath !== activePath && activePath !== 'trade') {
          active = '';
          this.setState({ activePairTab: active, selectedToOpen: active });
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
                this.setState({ activePairTab: active, selectedToOpen });
                let tabs = localStorage.getItem('tabs');
                if (tabs !== null &&
                    tabs !== '' &&
                    !JSON.parse(tabs).length) {
                    this.setNoTabs();
                }
            } else if (router && !router.params.pair) {
                active = "";
                this.setState({ activePairTab: active, selectedToOpen: active });
            }
            this.initTabs(pairs, active);
        }
        if (this.props.activeLanguage !== nextProps.activeLanguage) {
            this.initTabs(pairs, active);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { tabCount, pairs, calculateTabs } = this.props;
        const { activePairTab, selectedTabs } = this.state;

        if (tabCount !== prevProps.tabCount) {
            this.initTabs(pairs, activePairTab);
        }

        if (JSON.stringify(prevState.selectedTabs) !== JSON.stringify(selectedTabs)
            && !Object.keys(prevState.selectedTabs).length) {
            calculateTabs();
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
            if (activePair && !Object.keys(pairs).filter(value => value === activePair).length) {
                this.props.router.push('/trade/add/tabs');
            }
            tabs.map((key, index) => {
                if (pairs[key]) {
                    if (index <= this.props.tabCount - 1)
                        tempTabs[key] = pairs[key];
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
            }
            this.setState({
                selectedTabs: tempTabs,
                activeTabs: tempTabs,
                activeItems: Object.keys(tempTabs)
            });
            this.setTabsLocal(tempTabs);
        }
    };

    onTabClick = pair => {
        if (pair) {
            this.props.router.push(`/trade/${pair}`);
            this.setState({ activePairTab: pair });
        }
    };

    openAddTabMenu = () => {
      this.setState(prevState => ({
        isAddTab: !prevState.isAddTab,
      }));
    };

    onAddTabClick = pair => {
        this.setState({ selectedAddTab: pair });
    };



  addTradePairTab = pair => {
    const { selectedTabs, activeTabs, activePairTab, selectedToOpen } = this.state;
    const { pairs, tabCount } = this.props;
    let localTabs = {};
    let tabPairs = [];

    // if the pair is not in active tabs, add it to state and local storage
    if (!selectedTabs[pair]) {
      const temp = pairs[pair];
      if (temp && temp.pair_base) {
        localTabs = { ...selectedTabs, [pair]: temp };
        tabPairs = Object.keys(localTabs);
        this.setState({ selectedTabs: { ...localTabs }, selectedToOpen: pair, selectedToRemove: '' });
      }
      this.setTabsLocal(localTabs);
      this.onTabClick(pair);
    }
    if (!activeTabs[pair]) {
      let tempActive = activeTabs;
      let activeKeys = Object.keys(activeTabs);
      timeOut = setTimeout(() => {
        if (tabPairs.length <= tabCount) {
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

    if (activeTabs[pair]
      && pair !== activePairTab
      && selectedToOpen === activePairTab) {
      this.setState({ selectedToOpen: '' });
    }
    // this.setTabsLocal(localTabs);
    this.closeAddTabMenu();
  };

    onTabChange = pair => {
        const { selectedTabs, activeTabs, activePairTab, selectedToOpen } = this.state;
        const { pairs } = this.props;
        let localTabs = {};
        let tabPairs = [];

        // if the pair is in active tabs, remove it from state and local storage
        if (selectedTabs[pair]) {
            localTabs = { ...selectedTabs };
            tabPairs = Object.keys(localTabs);
            delete localTabs[pair];
            this.setTabsLocal(localTabs);

            // if the tab is currently active Go to the next available one. if it is the last tab, go to previous one.
            if (activePairTab === pair) {
                const index = tabPairs.indexOf(pair);
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
            // if the pair is not in active tabs, add it to state and local storage
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

    closeAddTabMenu = () => {
        this.setState({ isAddTab: false, searchValue: '', searchResult: {} });
    };

    handleSearch = (_, value) => {
        const { pairs, coins } = this.props;
        if (value) {
            const result = {};
            const searchValue = value.toLowerCase().trim();
            Object.keys(pairs).map(key => {
                const temp = pairs[key];
                const { fullname } = coins[temp.pair_base.toLowerCase()] || DEFAULT_COIN_DATA;
                const cashName = fullname ? fullname.toLowerCase() : '';
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
        const { activeItems, selectedTabs } = this.state;
        const startIndex = newIndex < 0 ? activeItems.length + newIndex : newIndex;
        const pairTemp = activeItems.filter((data, index) => index !== oldIndex);
        pairTemp.splice(startIndex, 0, activeItems[oldIndex]);
        const sortedTabs = {};
        pairTemp.forEach(data => {
            sortedTabs[data] = selectedTabs[data];
        });
        this.setTabsLocal({ ...sortedTabs, ...selectedTabs });
        this.setState({
            activeItems: pairTemp,
            activeTabs: { ...sortedTabs },
            selectedTabs: { ...sortedTabs, ...selectedTabs }
        });
    };

    getSymbols = (pairs) => {
      const obj = {};
      Object.entries(pairs).forEach(([key, pair]) => {
        obj[pair.pair_2] = '';
      });

      return Object.keys(obj).map((key) => key);
    }

    render() {
        const {
            selectedTabs,
            isAddTab,
            selectedAddTab,
            activePairTab,
            activeTabs,
            searchValue,
            searchResult,
            selectedToOpen,
            selectedToRemove
        } = this.state;

        const { pairs, tickers, location, coins } = this.props;

        const symbols = this.getSymbols(pairs);
        
        return (
            <div className="d-flex h-100">
                <TabList
                    /*axis, pressDelay and onSortEnd are SortableContainer HOC properties*/
                    axis={'x'}
                    pressDelay={200}
                    onSortEnd={this.onSortEnd}
                    items={this.state.activeItems}
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
                            addTradePairTab={this.addTradePairTab}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ app: { language: activeLanguage, pairs, tickers, coins }}) => ({
    activeLanguage,
    pairs,
    tickers,
    coins,
});

export default connect(mapStateToProps)(PairTabs);