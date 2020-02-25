import React, { Component } from 'react';
import { Tabs, Row } from 'antd';

import { GeneralSettingsForm, EmailSettingsForm, SecuritySettingsForm } from './SettingsForm';

const TabPane = Tabs.TabPane;

export default class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: ''
        };
    }
    tabChange = (activeTab) => {
        this.setState({ activeTab });
    };

    submitSettings = (formProps) => {
        console.log('formProps', formProps);
    };

    render() {
        return (
            <div className="app_container-content">
                <h1>Settings</h1>
                <Tabs onChange={this.tabChange}>
                    <TabPane tab={'General'} key={'general'}>
                        <Row>
                            <GeneralSettingsForm
                                handleSubmitSettings={this.submitSettings} />
                        </Row>
                    </TabPane>
                    <TabPane tab={'Email'} key={'email'}>
                        <Row>
                            <EmailSettingsForm
                                handleSubmitSettings={this.submitSettings} />
                        </Row>
                    </TabPane>
                    <TabPane tab={'Security'} key={'security'}>
                        <Row>
                            <SecuritySettingsForm
                                handleSubmitSettings={this.submitSettings} />
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
