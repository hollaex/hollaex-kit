import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Image from 'components/Image';
import { IconTitle, Notification, Button, BlueLink } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { sendSupportMail, NOTIFICATIONS, openContactForm } from '../../actions/appActions';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';


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
		const { onClose, activeTheme, icons: ICONS } = this.props;
		const { submited } = this.state;
		if (submited) {
			return (
				<Notification type={NOTIFICATIONS.CONTACT_FORM} onClose={onClose} />
			);
		}

		return (
			<div className="help-wrapper">
				<IconTitle
					iconId="QUESTION_MARK,QUESTION_MARK_COLOR"
					iconPath={activeTheme==='white' ? ICONS.QUESTION_MARK : ICONS.QUESTION_MARK_COLOR}
					stringId="HELPFUL_RESOURCES_TEXT"
					text={STRINGS["HELPFUL_RESOURCES_TEXT"]}
					textType="title"
					underline={true}
					className="w-100"
				/>
				<div>
					<div className='d-flex mt-5'>
						<Image
							iconId={activeTheme==='white' ? "LAPTOP" : "LAPTOP_COLOR"}
							icon={activeTheme==='white' ? ICONS.LAPTOP : ICONS.LAPTOP_COLOR}
							wrapperClassName='help_icons ml-1 mr-1'
						/>
						<div className='text' >
							{STRINGS["HELP_RESOURCE_GUIDE_TEXT"]}
							<BlueLink
								href={STRINGS["HELP_EXIR_TUTORIAL_LINK"]}
								text={STRINGS["HELP_EXIR_TUTORIAL_LINK"]}
							/>
							<EditWrapper stringId="HELP_RESOURCE_GUIDE_TEXT" />
						</div>
						<div className="w-25" />
					</div>
					<div className='d-flex mt-5 mb-5'>
						<Image
							iconId={activeTheme==='white' ? "TELEGRAM" : "TELEGRAM_COLOR"}
							icon={activeTheme==='white' ? ICONS.TELEGRAM : ICONS.TELEGRAM_COLOR}
							wrapperClassName='help_icons ml-1 mr-1'
						/>
						<div className='text' >
							{STRINGS["HELP_TELEGRAM_TEXT"]} 
							<BlueLink
								href={STRINGS["HELP_TELEGRAM_LINK"]}
								text={STRINGS["HELP_TELEGRAM_LINK"]}
							/>
							<EditWrapper stringId="HELP_TELEGRAM_TEXT,HELP_TELEGRAM_LINK" />
						</div>
						<div className="w-25" />
					</div>
					<div className="d-flex">
						<div className="w-50">
							<EditWrapper stringId="BACK_TEXT" />
							<Button label={STRINGS["BACK_TEXT"]} onClick={onClose}/>
						</div>
						<div className='separator' />
						<div className="w-50">
							<EditWrapper stringId="REQUEST_RESET_PASSWORD.SUPPORT" />
							<Button label={STRINGS["REQUEST_RESET_PASSWORD.SUPPORT"]} onClick={this.openNewForm}/>
						</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(HelpfulResourcesForm));
