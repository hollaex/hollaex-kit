import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactSVG from 'react-svg';
import { IconTitle, Notification, Button, BlueLink } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { sendSupportMail, NOTIFICATIONS, openContactForm } from '../../actions/appActions';


class HelpfulResourcesForm extends Component {
	state = {
		submited: false,
		initialValues: {}
	};

	componentDidMount() {
		if (this.props.email) {
			const initialValues = { email: this.props.email, ...this.props.contactFormData };
			this.setInitialValues(initialValues);
		}
	}

	setInitialValues = (initialValues = {}) => {
		this.setState({ initialValues })
	}

	onSubmit = (values) => {
		return sendSupportMail(values)
			.then((data) => {
				this.setState({ submited: true });

				// if (this.props.onSubmitSuccess) {
				//   this.props.onSubmitSuccess(data);
				// }
			})
			.catch((err) => {
				const _error = err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ _error });
			});
	};
	openNewForm=()=>{
		const { links = {} } = this.props.constants;
		this.props.onClose();
		this.props.openContactForm({ category: 'bug', helpdesk: links.helpdesk });
	};


	render() {
		const { onClose, activeTheme } = this.props;
		const { submited } = this.state;
		if (submited) {
			return (
				<Notification type={NOTIFICATIONS.CONTACT_FORM} onClose={onClose} />
			);
		}

		return (
			<div className="help-wrapper">
				<IconTitle
					iconPath={activeTheme==='white' ? ICONS.QUESTION_MARK : ICONS.QUESTION_MARK_COLOR}
					stringId="HELPFUL_RESOURCES_TEXT"
					text={STRINGS["HELPFUL_RESOURCES_TEXT"]}
					textType="title"
					underline={true}
					className="w-100"
					useSvg={true}
				/>
				<div>
					<div className='d-flex mt-5'>
						<ReactSVG path={activeTheme==='white' ? ICONS.LAPTOP : ICONS.LAPTOP_COLOR} wrapperClassName='help_icons ml-1 mr-1' />
						<div className='text' >
							{STRINGS["HELP_RESOURCE_GUIDE_TEXT"]}
							<BlueLink
								href={STRINGS["HELP_EXIR_TUTORIAL_LINK"]}
								text={STRINGS["HELP_EXIR_TUTORIAL_LINK"]}
							/>
						</div>
						<div className="w-25" />
					</div>
					<div className='d-flex mt-5 mb-5'>
						<ReactSVG path={activeTheme==='white' ? ICONS.TELEGRAM : ICONS.TELEGRAM_COLOR} wrapperClassName='help_icons ml-1 mr-1' />
						<div className='text' >
							{STRINGS["HELP_TELEGRAM_TEXT"]} 
							<BlueLink
								href={STRINGS["HELP_TELEGRAM_LINK"]}
								text={STRINGS["HELP_TELEGRAM_LINK"]}
							/>
						</div>
						<div className="w-25" />
					</div>
					<div className='w-100 buttons-wrapper d-flex' >
						<Button label={STRINGS["BACK_TEXT"]} onClick={onClose}/>
						<div className='separator' />
						<Button label={STRINGS["REQUEST_RESET_PASSWORD.SUPPORT"]} onClick={this.openNewForm}/>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	email: store.user.email,
	contactFormData: store.app.contactFormData,
	activeTheme: store.app.theme,
	constants: store.app.constants
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpfulResourcesForm);
