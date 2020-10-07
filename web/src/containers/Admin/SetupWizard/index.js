import React, { Component } from 'react';
import { Steps } from 'antd';

import TimeZone from './TimeZone';

import './index.css';

const { Step } = Steps;

export default class SetupWizard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: 0
        }
    }
    
    onTabChange = (tab) => {
        console.log('onTabChange', tab);
        this.setState({ currentTab: tab });

    };

    renderStep = () => {
        switch(this.state.currentTab) {
            case 0:
            default:
                return (
                    <TimeZone />
                );
        }
    }

    render() {
        return (
            <div className="wizard-container">
                <div className="content">
                    <div>
                        <div className="header">Operator exchange kit setup</div>
                        <div className="description">Follow the 6-step exchange configuration. Any steps you are uncertain about you can complete at a later date.</div>
                    </div>
                    <div className="step-container">
                        <div className="steps">
                            <Steps
                                current={this.state.currentTab}
                                direction="vertical"
                                onChange={this.onTabChange}
                            >
                                <Step title="1. Time zone & language" />
                                <Step title="2. Admin account security" />
                                <Step title="3. Assets & trading" />
                                <Step title="4. Trading interface" />
                                <Step title="5. Email and CAPTCHA" />
                            </Steps>
                        </div>
                        <div className="step-content">
                            {this.renderStep()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
