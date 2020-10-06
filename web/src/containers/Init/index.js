import React, { Component } from 'react';

import LoadingScreen from './LoadingScreen';
import WelcomeScreen from './WelcomeScreen';
import NetworkConfig from './NetworkConfig';
import EmailSetup from './EmailSetup';
import PasswordSetup, { ReTypePasswordContainer } from './PasswordSetup';
import { ICONS } from '../../config/constants';

export default class InitWizard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            currentStep: 'landing-page',
            formValues: {}
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 2000);
    }

    handleStepChange = (step) => {
        this.setState({ currentStep: step });
    };

    onFieldChange = (value, name) => {
        this.setState({
            formValues: {
                ...this.state.formValues,
                [name]: value
            }
        });
    };

    renderStep = () => {
        switch(this.state.currentStep) {
            case 'network-config':
                return (
                    <NetworkConfig
                        icon={ICONS.SET_ADMIN_NETWORK_KEYS}
                        onChangeStep={this.handleStepChange}
                    />
                );
            case 'email':
                return (
                    <EmailSetup
                        initialValues={this.state.formValues}
                        icon={ICONS.SET_ADMIN_EMAIL}
                        onChangeStep={this.handleStepChange}
                        onFieldChange={this.onFieldChange}
                    />
                );
            case 'password':
                return (
                    <PasswordSetup
                        icon={ICONS.SET_ADMIN_PASSWORD}
                        onChangeStep={this.handleStepChange}
                        onFieldChange={this.onFieldChange}
                    />
                );
            case 'retype-password':
                return (
                    <ReTypePasswordContainer
                        initialValues={this.state.formValues}
                        icon={ICONS.SET_ADMIN_RETYPE_PASSWORD}
                        onChangeStep={this.handleStepChange}
                    />
                );
            case 'landing-page':
            default:
                return <WelcomeScreen onChangeStep={this.handleStepChange} />;
        }
    };
    
    render() {
        return (
            <div className="init-container">
                {(this.state.isLoading)
                    ? <LoadingScreen />
                    : this.renderStep()
                }
            </div>
        )
    }
}
