import React from 'react';
import classnames from 'classnames';

const renderTitleBlock = (title, icon) => (
  <div className="tab_controller-title">
    {icon &&
      <img alt="titleIcon" src={icon} className="tab_controller-title-icon" />
    }
    {title &&
      <div className="tab_controller-title-text">{title}</div>
    }
  </div>
);

const TabController = ({ tabs, activeTab, setActiveTab, title, titleIcon }) => (
  <div className="tab_controller-wrapper">
    {(title || titleIcon) && renderTitleBlock(title, titleIcon)}
    <div className="tab_controller-tabs">
      {tabs.map((tab, index) => {
        return (
          <div
            key={`tab_item-${index}`}
            className={classnames(
              'tab_item', 'pointer', { 'tab_item-active': index === activeTab }
            )}
            onClick={() => setActiveTab(index)}
          >{tab.title}</div>
        )
      })}
    </div>
  </div>
);

TabController.defaultProps = {
  tabs: [],
}
export default TabController;
