import React, { Component } from 'react';

import LoadingScreen from './LoadingScreen';
import WelcomeScreen from './WelcomeScreen';
import EmailSetup from './EmailSetup';
import PasswordSetup from './PasswordSetup';

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
        }, 1000);
    }

    handleStepChange = (step) => {
        this.setState({ currentStep: step });
    };

    onFieldChange = (value, name) => {
        console.log('e.target', value, name);
        this.setState({
            formValues: {
                ...this.state.formValues,
                [name]: value
            }
        });
    };

    renderStep = () => {
        switch(this.state.currentStep) {
            case 'email':
                return (
                    <EmailSetup
                        initialValues={this.state.formValues}
                        onChangeStep={this.handleStepChange}
                        onFieldChange={this.onFieldChange}
                    />
                );
            case 'password':
                return (
                    <PasswordSetup
                        onChangeStep={this.handleStepChange}
                        onFieldChange={this.onFieldChange}
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
