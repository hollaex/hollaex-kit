import React, { Component } from 'react';
import STRINGS from 'config/localizedStrings';
import { Dialog, IconTitle, Button } from 'components';
import { EditWrapper } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

class VerificationSentModal extends Component {
	render() {
		const { icons: ICONS, onCloseDialog, ...rest } = this.props;

		return (
			<Dialog
				label="token-modal"
				onCloseDialog={onCloseDialog}
				shouldCloseOnOverlayClick={false}
				showCloseText={false}
				{...rest}
			>
				<div className="quote-review-wrapper">
					<IconTitle
						iconId="EMAIL_SENT"
						iconPath={ICONS['EMAIL_SENT']}
						stringId="USER_VERIFICATION.VERIFICATION_SENT"
						text={STRINGS['USER_VERIFICATION.VERIFICATION_SENT']}
						textType="title"
						className="w-100"
					/>
					<div>
						<div className="mt-1 mb-5 text-center">
							<EditWrapper stringId="USER_VERIFICATION.VERIFICATION_SENT_INFO">
								<div>{STRINGS['USER_VERIFICATION.VERIFICATION_SENT_INFO']}</div>
							</EditWrapper>
						</div>
						<div className="w-100 buttons-wrapper d-flex">
							<Button
								label={STRINGS['USER_VERIFICATION.OKAY']}
								onClick={onCloseDialog}
							/>
						</div>
					</div>
				</div>
			</Dialog>
		);
	}
}

export default withConfig(VerificationSentModal);
