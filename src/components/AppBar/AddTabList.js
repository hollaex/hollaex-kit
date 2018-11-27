import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import { reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class AddTabList extends Component {

    componentDidMount() {
        document.addEventListener('click', this.onOutsideClick);
    }

    onOutsideClick = event => {
        const element = document.getElementById('add-tab-list-menu');
        if (element &&
            event.target !== element &&
            !element.contains(event.target)) {
                this.props.closeAddTabMenu();
        }
    };

    handleChange = pair => {
        this.props.onTabChange(pair);
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.onOutsideClick);
    }

    render() {
        const { symbols, pairs, selectedTabs, selectedTabMenu, searchValue, searchResult, onAddTabClick, handleSearch } = this.props;
        let tabMenu = {};
        if (searchValue) {
            tabMenu = { ...searchResult };
        } else {
            Object.keys(pairs).map(key => {
                let temp = pairs[key];
                if (temp && temp.pair_base === selectedTabMenu){
                    tabMenu[key] = temp;
                }
                return key;
            });
        }
    
        const searchField = {
            search: {
                type: 'text',
                options: { icon: ICONS.SEARCH, label: 'search' },
                className: 'app-bar-search-field',
                hideCheck: true,
                outlineClassName: 'app-bar-search-field-outline',
                placeholder: 'Search...',
                onChange: handleSearch
            }
        };
    
        return (
            <div id="add-tab-list-menu" className="app-bar-add-tab-menu">
                <div className="app-bar-tab-menu d-flex justify-content-between">
                    <div className="d-flex">
                        {symbols.map((symbol, index) =>
                            <div
                                key={index}
                                className={classnames(
                                    "app-bar-tab-menu-list",
                                    "d-flex",
                                    "align-items-center",
                                    { 'active-tab': symbol === selectedTabMenu })}
                                onClick={() => onAddTabClick(symbol)}>
                                {symbol.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="d-flex align-items-center mr-2">
                        {/* <ReactSVG
                            path={ICONS.TAB_SETTING}
                            wrapperClassName="app-bar-tab-setting" /> */}
                    </div>
                </div>
                <div className="app-bar-add-tab-content">
                    <div className="app-bar-add-tab-search">
                        {renderFields(searchField)}
                    </div>
                    {Object.keys(tabMenu).length
                        ? Object.keys(tabMenu).map((pair, index) => {
                            let menu = tabMenu[pair];
                            return (
                                <div
                                    key={index}
                                    className="app-bar-add-tab-content-list d-flex align-items-center"
                                    onClick={() => this.handleChange(pair)}>
                                    <div>
                                        {selectedTabs[pair] 
                                            ? <ReactSVG path={ICONS.TAB_MINUS} wrapperClassName="app-bar-tab-setting" />
                                            : <ReactSVG path={ICONS.TAB_PLUS} wrapperClassName="app-bar-tab-setting" />
                                        }
                                    </div>
                                    <ReactSVG path={ICONS[`${menu.pair_base.toUpperCase()}_ICON`]} wrapperClassName="app-bar-add-tab-icons" />
                                    <div className="app_bar-pair-font">
                                        {STRINGS[`${menu.pair_base.toUpperCase()}_SHORTNAME`]}/{STRINGS[`${menu.pair_2.toUpperCase()}_SHORTNAME`]}:
                                    </div>
                                    <div className="title-font"> T 65,800,000 </div>
                                    <div className="app-price-diff-red app-bar-price_difference app_bar-pair-font"> -120,000 </div>
                                    <div className="app-price-diff-red title-font app_bar-pair-font ml-1">-1.71 %</div>
                                </div>
                            )}
                        )
                        : <div className="app-bar-add-tab-content-list d-flex align-items-center">
                            No data...
                        </div>
                    }
                </div>
            </div>
        );
    }
};

export default reduxForm({
    form: 'addTabSearch'
})(AddTabList);