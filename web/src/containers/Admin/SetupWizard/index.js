import React, { Component } from 'react';
import { Steps } from 'antd';

import TimeZone from './TimeZone';
import AccountSecurity from './AccountSecurity';
import Assets from './Assets';
import TradingInterface from './TradingInterface';
import EmailConfiguration from './EmailConfiguration';
import ExchangeReview from './Review';
import SetupComplete from './SetupComplete';
import { updatePlugins, getConstants } from '../Settings/action';

import './index.css';

const { Step } = Steps;

export default class SetupWizard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: 0,
            isReview: false,
            isConfirmScreen: false,
            constants: {}
        }
    }

    componentDidMount() {
        getConstants()
            .then((res) => {
                this.setConstants(res);
            })
    }
    
    onTabChange = (tab) => {
        this.setState({ currentTab: tab });
    };

    setConstants = (data) => {
        this.setState({ constants: data });
    };

    setPreview = (value = false) => {
        this.setState({ isReview: value });
    };

    setConfirm = (value = false) => {
        this.setState({ isConfirmScreen: value, isReview: false });
    };

    updateConstants = (formValues, callback = () => {}) => {
        updatePlugins(formValues)
            .then((res) => {
                this.setConstants(res);
                callback();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    renderStep = () => {
        switch(this.state.currentTab) {
            case 0:
                return (<TimeZone handleNext={this.onTabChange} updateConstants={this.updateConstants} />);
            case 1:
                return (<AccountSecurity handleNext={this.onTabChange} />);
            case 2:
                return (<Assets handleNext={this.onTabChange} />);
            case 3:
                return (<TradingInterface handleNext={this.onTabChange} updateConstants={this.updateConstants} />);
            case 4:
                return (
                    <EmailConfiguration
                        handleNext={this.onTabChange}
                        updateConstants={this.updateConstants}
                        setPreview={this.setPreview}
                    />
                );
            default:
                return (<div></div>);
        }
    }

    render() {
        const { isReview, isConfirmScreen, constants } = this.state;
        if (isReview) {
            return (<ExchangeReview constants={constants} setPreview={this.setPreview} setConfirm={this.setConfirm} />);
        } else if (isConfirmScreen) {
            return (<SetupComplete />);
        }
        return (
            <div className="wizard-container">
                <div className="content">
                    <div>
                        <div className="header">OPERATOR EXCHANGE KIT SETUP</div>
                        <div className="description">Follow the 6-step exchange configuration. Any steps you are uncertain about you can complete at a later date.</div>
                    </div>
                    <div className="step-container">
                        <div className="steps">
                            <div className="step-title title-text">Steps <span className="description">(optional)</span></div>
                            <Steps
                                current={this.state.currentTab}
                                direction="vertical"
                                onChange={this.onTabChange}
                            >
                                <Step title="1. Time zone & language" />
                                <Step title="2. Admin account security" />
                                <Step title="3. Assets & trading" />
                                <Step title="4. Trading interface" />
                                <Step title="5. Email" />
                            </Steps>
                        </div>
                        <div className="step-separator"></div>
                        <div className="step-content">
                            {this.renderStep()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
