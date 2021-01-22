import React, { Component } from 'react';
import { CheckOutlined } from '@ant-design/icons';

import LoadingScreen from './LoadingScreen';
import WelcomeScreen from './WelcomeScreen';
import NetworkConfig from './NetworkConfig';
import EmailSetup from './EmailSetup';
import PasswordSetup, { ReTypePasswordContainer } from './PasswordSetup';
import Login from './Login';
import { STATIC_ICONS } from 'config/icons';
import { getExchangeInitialized } from '../../utils/initialize';

class InitWizard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			currentStep: 'landing-page',
			formValues: {},
			message: '',
		};
	}

	componentDidMount() {
		const initialized = getExchangeInitialized();
		if (
			initialized === 'true' ||
			(typeof initialized === 'boolean' && initialized)
		) {
			this.props.router.push('/admin');
		}
		setTimeout(() => {
			this.setState({ isLoading: false });
		}, 2000);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.message !== prevState.message && this.state.message) {
			setTimeout(() => {
				this.setMessage('');
			}, 10000);
		}
	}

	handleStepChange = (step) => {
		this.setState({ currentStep: step });
	};

	onFieldChange = (value, name) => {
		this.setState({
			formValues: {
				...this.state.formValues,
				[name]: value,
			},
		});
	};

	setMessage = (message) => {
		this.setState({ message });
	};

	renderStep = () => {
		switch (this.state.currentStep) {
			case 'network-config':
				return (
					<NetworkConfig
						icon={STATIC_ICONS.SET_ADMIN_NETWORK_KEYS}
						onChangeStep={this.handleStepChange}
					/>
				);
			case 'email':
				return (
					<EmailSetup
						initialValues={this.state.formValues}
						icon={STATIC_ICONS.SET_ADMIN_EMAIL}
						onChangeStep={this.handleStepChange}
						onFieldChange={this.onFieldChange}
					/>
				);
			case 'password':
				return (
					<PasswordSetup
						icon={STATIC_ICONS.SET_ADMIN_PASSWORD}
						onChangeStep={this.handleStepChange}
						onFieldChange={this.onFieldChange}
					/>
				);
			case 'retype-password':
				return (
					<ReTypePasswordContainer
						initialValues={this.state.formValues}
						icon={STATIC_ICONS.SET_ADMIN_RETYPE_PASSWORD}
						setMessage={this.setMessage}
						onChangeStep={this.handleStepChange}
					/>
				);
			case 'login':
				return <Login onChangeStep={this.handleStepChange} />;
			case 'landing-page':
			default:
				return <WelcomeScreen onChangeStep={this.handleStepChange} />;
		}
	};

	render() {
		const { message, isLoading } = this.state;
		return (
			<div className="init-container">
				{message ? (
					<div className="message success">
						<CheckOutlined color="#ffffff" /> {message}
					</div>
				) : null}
				{isLoading ? <LoadingScreen /> : this.renderStep()}
			</div>
		);
	}
}

export default InitWizard;
