import React from 'react';

const TabController = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tab_controller">
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
  )
}

TabController.defaultProps = {
  tabs: [],
}
export default TabController;
