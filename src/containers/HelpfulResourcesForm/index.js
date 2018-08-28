import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { HocForm, IconTitle, Notification, Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { sendSupportMail, NOTIFICATIONS, openContactForm } from '../../actions/appActions';
import './helpfulResources.css';
import { bindActionCreators } from 'redux';
import { logout } from '../../actions/authAction';

const FORM_NAME = 'HelpfulResourcesForm';

const Form = HocForm(FORM_NAME, { enableReinitialize: true });

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
		this.props.openContactForm();
		this.props.onClose();
	};


	render() {
		const { onClose, openContactForm } = this.props;
		const { submited, initialValues } = this.state;

		if (submited) {
			return (
				<Notification type={NOTIFICATIONS.CONTACT_FORM} onClose={onClose} />
			);
		}


		return (
			<div className="contact_form-wrapper" style={{width: '50rem'}}>
				<IconTitle
					iconPath={ICONS.QUESTION_MARK}
					text={STRINGS.HELPFUL_RESOURCES_TEXT}
					textType="title"
					underline={true}
					className="w-100"
					useSvg={true}
				/>
				<div>
					<div className='cardDiv'>
						<div><img src={ICONS.LAPTOP} className='cardIcon'/></div>
						<div className='cardText'>Find videos and PDF guides explaining how to use EXIR on our
						tutorial guide section of our website: <a href='https://www.exir.io/tutorial/' style={{color:'blue'}}>https://www.exir.io/tutorial/</a></div>
					</div>
					<div className='cardDiv'>
						<img src={ICONS.TELEGRAM} className='cardIcon'/>
						<div className='cardText'>
							Join our Telegram group to get the latest updates on EXIR and
							crypto trading news: <a href="https://t.me/exirofficial" style={{color:'blue'}}>https://t.me/exirofficial</a>
						</div>
					</div>
					<div className='buttonDiv'>
						<Button className='cardButton' label='BACK' onClick={onClose}/>
						<Button className='cardButton' label='CONTACT SUPPORT' onClick={this.openNewForm}/>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	email: store.user.email,
	contactFormData: store.app.contactFormData
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpfulResourcesForm);
