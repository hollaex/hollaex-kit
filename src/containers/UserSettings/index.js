import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';

import { updateUser, setUserData } from '../../actions/userAction';
import { Accordion } from '../../components';
import SettingsForm, { generateFormValues } from './SettingsForm';

import STRINGS from '../../config/localizedStrings';

class UserSettings extends Component {
	state = {
		sections: [],
		dialogIsOpen: false,
		modalText: ''
	};

	componentDidMount() {
		this.calculateSections(this.props.settings);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.calculateSections(nextProps.settings);
		}
	}

	calculateSections = (settings = {}) => {
		const formValues = generateFormValues();

		const sections = [
			{
				title: STRINGS.ACCOUNTS.TAB_SETTINGS,
				content: (
					<SettingsForm
						onSubmit={this.onSubmitSettings}
						formFields={formValues}
						initialValues={settings}
					/>
				),
				isOpen: true
			}
		];

		this.setState({ sections });
	};

	onSubmitSettings = (settings) => {
		return updateUser({ settings })
			.then(({ data }) => {
				this.props.setUserData(data);
			})
			.catch((err) => {
				// console.log(err.response.data);
				const _error = err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ _error });
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
	activeLanguage: state.app.language
});

const mapDispatchToProps = (dispatch) => ({
	setUserData: bindActionCreators(setUserData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
