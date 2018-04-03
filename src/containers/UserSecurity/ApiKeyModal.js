import React, { Component } from 'react';
import { OtpForm, Loader, Notification } from '../../components';
import { NOTIFICATIONS } from '../../actions/appActions';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { PopupInfo } from './DeveloperSection'
export const TYPE_REVOKE = 'TYPE_REVOKE';
export const TYPE_GENERATE = 'TYPE_GENERATE';

export class ApiKeyModal extends Component {
	state = {
		dialogOtpOpen: false,
		loading: false
	};

	componentWillReceiveProps(nextProps) {
		if (
			!nextProps.submitting &&
			nextProps.submitting !== this.props.submitting
		) {
			this.onCloseDialog();
		}
	}

	onClickNext = () => {
		this.setState({ dialogOtpOpen: true });
	};

	onSubmit = (values) => {
		console.log(values);
		this.setState({ loading: true });
		const { otp_code } = values;
		let submit =
			this.props.notificationType === TYPE_REVOKE
				? this.props.onRevoke
				: this.props.onGenerate;
		return submit(otp_code);
	};

	onCloseDialog = () => {
		this.props.onCloseDialog();
	};
	render() {
		const { dialogOtpOpen, loading } = this.state;
		const { submitting, notificationType, openContactForm } = this.props;
		if (dialogOtpOpen) {
			return <OtpForm onSubmit={this.onSubmit} onClickHelp={openContactForm} />;
		} else if (submitting || loading) {
			return <Loader relative={true} background={false} />;
		} else {
			const icon =
				notificationType === TYPE_REVOKE
					? ICONS.TOKEN_TRASHED
					: ICONS.TOKEN_GENERATE;
			const nextLabel =
				notificationType === TYPE_REVOKE
					? STRINGS.DEVELOPERS_TOKENS_POPUP.DELETE
					: STRINGS.DEVELOPERS_TOKENS_POPUP.GENERATE;
			return (
				<Notification
					icon={icon}
					onBack={this.onCloseDialog}
					onNext={this.onClickNext}
					nextLabel={nextLabel}
					disabledNext={false && notificationType === TYPE_GENERATE}
					type={NOTIFICATIONS.GENERATE_API_KEY}
				>
					<PopupInfo type={notificationType === TYPE_REVOKE ? 'DELETE' : 'GENERATE'} />
				</Notification>
			);
		}
	}
}
