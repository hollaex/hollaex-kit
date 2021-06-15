import React from 'react';
import Image from 'components/Image';

import { Button, PanelInformationRow } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { MAX_NUMBER_BANKS } from '../../config/constants';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';

const BankVerificationHome = ({
	user,
	setActivePageContent,
	handleBack,
	icons: ICONS,
}) => {
	const { bank_account } = user;
	if (
		!bank_account.length ||
		bank_account.length ===
			bank_account.filter((data) => data.status === 0).length
	) {
		return (
			<div className="btn-wrapper">
				<div className="holla-verification-button">
					<EditWrapper stringId="USER_VERIFICATION.START_BANK_VERIFICATION" />
					<Button
						label={STRINGS['USER_VERIFICATION.START_BANK_VERIFICATION']}
						onClick={() => setActivePageContent('bank')}
					/>
				</div>
			</div>
		);
	} else {
		const lastVerified = bank_account[bank_account.length - 1];
		const List = bank_account.map((account, index) => {
			if (account.status !== 0) {
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
							<PanelInformationRow
								stringId="USER_VERIFICATION.BANK_NAME"
								label={STRINGS['USER_VERIFICATION.BANK_NAME']}
								information={account.bank_name}
								className="title-font"
								disable
							/>
							<div className="d-flex">
								<PanelInformationRow
									stringId="USER_VERIFICATION.ACCOUNT_NUMBER"
									label={STRINGS['USER_VERIFICATION.ACCOUNT_NUMBER']}
									information={account.account_number}
									className="mr-3 title-font"
									disable
								/>
							</div>
						</div>
					</div>
				);
			}
			return null;
		});
		return (
			<div>
				<div className="font-weight-bold text-lowercase">
					{STRINGS.formatString(
						STRINGS['USER_VERIFICATION.BANK_VERIFICATION_HELP_TEXT'],
						<span
							className="verification_link pointer"
							onClick={(e) => handleBack('document', e)}
						>
							{STRINGS['USER_VERIFICATION.DOCUMENT_SUBMISSION']}
						</span>
					)}
					<EditWrapper stringId="USER_VERIFICATION.BANK_VERIFICATION_HELP_TEXT,USER_VERIFICATION.DOCUMENT_SUBMISSION" />
				</div>
				{List}
				{lastVerified.status === 3 && MAX_NUMBER_BANKS > bank_account.length ? (
					<div>
						<EditWrapper stringId="USER_VERIFICATION.ADD_ANOTHER_BANK_ACCOUNT" />
						<Button
							label={STRINGS['USER_VERIFICATION.ADD_ANOTHER_BANK_ACCOUNT']}
							onClick={() => setActivePageContent('bank')}
						/>
					</div>
				) : null}
			</div>
		);
	}
};

export default withConfig(BankVerificationHome);
