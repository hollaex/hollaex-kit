import React from 'react';

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
            className={`tab_item ${index === activeTab ? 'tab_item-active' : ''}`}
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
