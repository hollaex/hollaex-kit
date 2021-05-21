import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import Image from 'components/Image';
import { IconTitle, Notification, Button, BlueLink } from '../../components';
import STRINGS from '../../config/localizedStrings';
import {
	sendSupportMail,
	NOTIFICATIONS,
	openContactForm,
} from 'actions/appActions';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';

class HelpfulResourcesForm extends Component {
	state = {
		submited: false,
		initialValues: {},
	};

	componentDidMount() {
		if (this.props.email) {
			const initialValues = {
				email: this.props.email,
				...this.props.contactFormData,
			};
			this.setInitialValues(initialValues);
		}
	}

	setInitialValues = (initialValues = {}) => {
		this.setState({ initialValues });
	};

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
	openNewForm = () => {
		const { openContactForm, onClose } = this.props;
		onClose();
		openContactForm({ category: 'bug' });
	};

	render() {
		const {
			onClose,
			icons: ICONS,
			constants: { links: { api_doc_link = '' } = {} },
			openContactForm,
		} = this.props;
		const { submited } = this.state;

		if (submited) {
			return (
				<Notification type={NOTIFICATIONS.CONTACT_FORM} onClose={onClose} />
			);
		}

		return (
			<div className="help-wrapper">
				<IconTitle
					iconId="QUESTION_MARK"
					iconPath={ICONS['QUESTION_MARK']}
					stringId="HELPFUL_RESOURCES_TEXT"
					text={STRINGS['HELPFUL_RESOURCES_TEXT']}
					textType="title"
					underline={true}
					className="w-100"
				/>
				<div>
					<div className="d-flex mt-5">
						<Image
							iconId="LAPTOP"
							icon={ICONS['LAPTOP']}
							wrapperClassName="help_icons ml-1 mr-1"
						/>
						<div className="text">
							{STRINGS.formatString(
								STRINGS['HELP_RESOURCE_GUIDE.TEXT'],
								<span
									onClick={openContactForm}
									className={classnames('blue-link', 'dialog-link', 'pointer')}
								>
									{STRINGS['HELP_RESOURCE_GUIDE.CONTACT_US']}
								</span>
							)}
							<EditWrapper stringId="HELP_RESOURCE_GUIDE.TEXT,HELP_RESOURCE_GUIDE.CONTACT_US" />
						</div>
						<div className="w-25" />
					</div>
					<div className="d-flex mt-5 mb-5">
						<Image
							iconId="TELEGRAM"
							icon={ICONS['TELEGRAM']}
							wrapperClassName="help_icons ml-1 mr-1"
						/>
						<div className="text">
							{STRINGS['HELP_TELEGRAM_TEXT']}
							<BlueLink href={api_doc_link} text={api_doc_link} />
							<EditWrapper stringId="HELP_TELEGRAM_TEXT,HELP_TELEGRAM_LINK" />
						</div>
						<div className="w-25" />
					</div>
					<div className="d-flex">
						<div className="w-50">
							<EditWrapper stringId="BACK_TEXT" />
							<Button label={STRINGS['BACK_TEXT']} onClick={onClose} />
						</div>
						<div className="separator" />
						<div className="w-50">
							<EditWrapper stringId="REQUEST_RESET_PASSWORD.SUPPORT" />
							<Button
								label={STRINGS['REQUEST_RESET_PASSWORD.SUPPORT']}
								onClick={this.openNewForm}
							/>
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
	constants: store.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(HelpfulResourcesForm));
