import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { setLanguage, changeTheme } from '../../actions/appActions';
import { updateUser, setUserData, setUsername, setUsernameStore } from '../../actions/userAction';
import { Accordion } from '../../components';
import SettingsForm, { generateFormValues } from './SettingsForm';
import UsernameForm, { generateUsernameFormValues } from './UsernameForm';

import STRINGS from '../../config/localizedStrings';

class UserSettings extends Component {
	state = {
		sections: [],
		dialogIsOpen: false,
		modalText: ''
	};

	componentDidMount() {
		this.calculateSections(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.calculateSections(nextProps);
		}
	}

	calculateSections = ({ username = 'XX', settings = {}}) => {
		const formValues = generateFormValues();
		const usernameFormValues = generateUsernameFormValues(settings.usernameIsSet);

		const sections = [
			{
				title: STRINGS.TAB_USERNAME,
				content: (
					<UsernameForm
						onSubmit={this.onSubmitUsername}
						formFields={usernameFormValues}
						initialValues={{ username }}
					/>
				)
			},
			{
				title: STRINGS.ACCOUNTS.TAB_SETTINGS,
				content: (
					<SettingsForm
						onSubmit={this.onSubmitSettings}
						formFields={formValues}
						initialValues={settings}
					/>
				)
			}
		];

		this.setState({ sections });
	};

	onSubmitSettings = (settings) => {
		return updateUser({ settings })
			.then(({ data }) => {
				this.props.setUserData(data);
				this.props.changeLanguage(data.settings.language);
				this.props.changeTheme(data.settings.theme);
			})
			.catch((err) => {
				// console.log(err.response.data);
				const _error = err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ _error });
			});
	};

	onSubmitUsername = (values) => {
		return setUsername(values)
			.then(() => {
				this.props.setUsernameStore(values.username);
			})
			.catch((err) => {
				// console.log(err.response.data);
				const _error = err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ username: _error });
			});
	};

	render() {
		if (this.props.verification_level === 0) {
			return <div>Loading</div>;
		}

		const { sections } = this.state;
		return <Accordion sections={sections} />;
	}
}

const mapStateToProps = (state) => ({
	verification_level: state.user.verification_level,
	settings: state.user.settings,
	username: state.user.username,
	activeLanguage: state.app.language
});

const mapDispatchToProps = (dispatch) => ({
	setUsernameStore: bindActionCreators(setUsernameStore, dispatch),
	setUserData: bindActionCreators(setUserData, dispatch),
	changeLanguage: bindActionCreators(setLanguage, dispatch),
	changeTheme: bindActionCreators(changeTheme, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
