import React, { Component } from 'react';
import { Tabs, Row } from 'antd';
import { S3Form, SNSForm, Freshdesk} from './pluginForm';

const TabPane = Tabs.TabPane;

export default class Plugins extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: ''
        };
    }

    tabChange = (activeTab) => {
        this.setState({ activeTab });
    };

    handleSubmitPlugins = () => {
      console.log('formProps');
    }

  handleSubmitVault = (formProps) => {
    console.log('formProps', formProps);
  };

    render() {
        return (
            <div className="app_container-content">
                <h1>Plugins</h1>
                <Tabs onChange={this.tabChange}>
                    <TabPane tab={'S3'} key={'s3'}>
                        <Row>
                          <S3Form handleSubmitVault={this.handleSubmitVault}/>
                        </Row>
                    </TabPane>
                    <TabPane tab={'SNS'} key={'sns'}>
                        <Row>
                          <SNSForm handleSubmitVault={this.handleSubmitVault}/>
                        </Row>
                    </TabPane>
                    <TabPane tab={'Freshdesk'} key={'freshdesk'}>
                        <Row>
                          <Freshdesk handleSubmitVault={this.handleSubmitVault}/>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
