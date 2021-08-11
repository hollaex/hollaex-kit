import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';

import Pairs from './Pairs';
import { getTabParams } from '../AdminFinancials/Assets';
import './index.css';

const TabPane = Tabs.TabPane;

const PairsTab = (props) => {
    const [hideTabs, setHideTabs] = useState(false);
    const [activeTab, setActiveTab] = useState('0');
    const tabParams = getTabParams();
    
    useEffect(() => {
        if (tabParams) {
            setActiveTab(tabParams.tab);
        }
    }, [tabParams]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        props.router.replace('/admin/trade');
    }

    const handleHide = () => {
        setHideTabs(v => !v)
    }

    const renderTabBar = (props, DefaultTabBar) => {
        if (hideTabs) return <div></div>;
        return (
            <DefaultTabBar {...props} />
        );
    };

    return (
        <div className="admin-earnings-container w-100">
            <Tabs
                defaultActiveKey="0"
                activeKey={activeTab}
                onChange={handleTabChange}
                renderTabBar={renderTabBar}
            >
                <TabPane tab="Pairs" key="0">
                    <Pairs
                        location={props.location}
                        handleHide={handleHide}
                    />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default PairsTab;
