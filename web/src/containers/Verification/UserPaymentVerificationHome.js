import React from 'react';
import { EditWrapper, Button, PanelInformationRow, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { generateDynamicStringKey } from 'utils/id';

export const HIDDEN_KEYS = ['id', 'status', 'type'];

const UserPaymentVerificationHome = ({
	user,
	setActivePageContent,
	handleBack,
	icons: ICONS,
}) => {
	const { bank_account } = user;

	const renderList = () => {
		const List = bank_account
			.filter(({ status }) => status !== 0)
			.map((account, index) => {
				const { type = 'bank' } = account;
				const generateId = generateDynamicStringKey('ULTIMATE_FIAT', type);

				return (
					<div key={index} className="d-flex my-4">
						{account.status === 1 && (
							<div className="d-flex align-items-center mr-3">
								<Image
									iconId="PENDING_TIMER"
									icon={ICONS['PENDING_TIMER']}
									wrapperClassName="account-pending-icon"
								/>
							</div>
						)}
						<div className="w-100">
							{Object.keys(account)
								.filter((data) => !HIDDEN_KEYS.includes(data))
								.map((data) => {
									const stringId = generateId(data);
									const defaultText = data.replace(/_/g, ' ');
									return (
										<PanelInformationRow
											stringId={stringId}
											label={STRINGS[stringId] || defaultText}
											information={account[data]}
											className="title-font"
											disable
										/>
									);
								})}
						</div>
					</div>
				);
			});
		return List;
	};

	if (
		!bank_account.length ||
		bank_account.length ===
			bank_account.filter((data) => data.status === 0).length
	) {
		return (
			<div className="btn-wrapper">
				<div className="holla-verification-button">
					<EditWrapper stringId="USER_VERIFICATION.START_PAYMENT_VERIFICATION" />
					<Button
						label={STRINGS['USER_VERIFICATION.START_PAYMENT_VERIFICATION']}
						onClick={() => setActivePageContent('user_payments')}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div className="font-weight-bold text-lowercase">
					{STRINGS.formatString(
						STRINGS['USER_VERIFICATION.PAYMENT_VERIFICATION_HELP_TEXT'],
						<span
							className="verification_link pointer"
							onClick={(e) => handleBack('kyc', e)}
						>
							{STRINGS['USER_VERIFICATION.DOCUMENT_SUBMISSION']}
						</span>
					)}
					<EditWrapper stringId="USER_VERIFICATION.PAYMENT_VERIFICATION_HELP_TEXT,USER_VERIFICATION.DOCUMENT_SUBMISSION" />
				</div>
				{renderList()}
				<div>
					<EditWrapper stringId="USER_VERIFICATION.ADD_ANOTHER_PAYMENT_METHOD" />
					<Button
						label={STRINGS['USER_VERIFICATION.ADD_ANOTHER_PAYMENT_METHOD']}
						onClick={() => setActivePageContent('user_payments')}
					/>
				</div>
			</div>
		);
	}
};

export default withConfig(UserPaymentVerificationHome);
