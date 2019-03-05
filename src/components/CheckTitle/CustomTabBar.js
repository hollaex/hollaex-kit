import React from 'react';
import classnames from 'classnames';

const CustomTabBar = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="custom-tab-wrapper d-flex justify-content-between flex-nowrap flex-row">
            {tabs.map((tab, index) => {
                const tabProps = {
                    key: `tab_item-${index}`,
                    className: classnames('tab_item', 'f-1', {
                        'tab_item-active': index === activeTab,
                        pointer: setActiveTab
                    })
                };
                if (setActiveTab) {
                    tabProps.onClick = () => setActiveTab(index);
                }

                return <div {...tabProps}>{tab.title}</div>;
            })}
        </div>
    );
};

export default CustomTabBar;