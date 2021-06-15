import React from 'react';

import { Button, PanelInformationRow } from '../../components';
import { getCountry } from './utils';
import STRINGS from '../../config/localizedStrings';
import { getFormatTimestamp } from '../../utils/utils';
import { EditWrapper } from 'components';

const formatBirthday = {
	en: 'DD, MMMM, YYYY',
	fa: 'jDD, jMMMM, jYYYY',
};

const IdentityVerificationHome = ({
	user,
	activeLanguage,
	setActivePageContent,
	handleBack,
}) => {
	const { address, id_data } = user;
	if (!address.country) {
		return (
			<div className="btn-wrapper">
				<div className="holla-verification-button">
					<EditWrapper stringId="USER_VERIFICATION.START_IDENTITY_VERIFICATION" />
					<Button
						label={STRINGS['USER_VERIFICATION.START_IDENTITY_VERIFICATION']}
						onClick={() => setActivePageContent('kyc')}
					/>
				</div>
			</div>
		);
	} else {
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
				<div className="my-3">
					<PanelInformationRow
						stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL"
						label={
							STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.FULL_NAME_LABEL'
							]
						}
						information={user.full_name}
						className="title-font"
						disable
					/>
					<div className="d-flex">
						<PanelInformationRow
							stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN,USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN"
							label={
								STRINGS[
									'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_LABEL'
								]
							}
							information={
								user.gender === false
									? STRINGS[
											'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.MAN'
									  ]
									: STRINGS[
											'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.GENDER_OPTIONS.WOMAN'
									  ]
							}
							className="title-font divider"
							disable
						/>
						<PanelInformationRow
							stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL"
							label={
								STRINGS[
									'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.DOB_LABEL'
								]
							}
							information={getFormatTimestamp(
								user.dob,
								formatBirthday[activeLanguage]
							)}
							className="title-font"
							disable
						/>
					</div>
					<PanelInformationRow
						stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL"
						label={
							STRINGS[
								'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.NATIONALITY_LABEL'
							]
						}
						information={getCountry(user.nationality).name}
						className="title-font"
						disable
					/>
					<div className="d-flex">
						<PanelInformationRow
							stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL"
							label={
								STRINGS[
									'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.COUNTRY_LABEL'
								]
							}
							information={getCountry(address.country).name}
							className="title-font divider"
							disable
						/>
						<PanelInformationRow
							stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL"
							label={
								STRINGS[
									'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.CITY_LABEL'
								]
							}
							information={address.city}
							className="title-font"
							disable
						/>
					</div>
					<div className="d-flex">
						<div className="w-75">
							<PanelInformationRow
								stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL"
								label={
									STRINGS[
										'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
									]
								}
								information={address.address}
								className="title-font divider"
								disable
							/>
						</div>
						<PanelInformationRow
							stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL"
							label={
								STRINGS[
									'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.POSTAL_CODE_LABEL'
								]
							}
							information={address.postal_code}
							className="title-font"
							disable
						/>
					</div>
				</div>
				{id_data.status === 3 ? null : (
					<div className="btn-wrapper">
						<div className="holla-verification-button">
							<EditWrapper stringId="USER_VERIFICATION.REVIEW_IDENTITY_VERIFICATION" />
							<Button
								label={
									STRINGS['USER_VERIFICATION.REVIEW_IDENTITY_VERIFICATION']
								}
								onClick={() => setActivePageContent('kyc')}
							/>
						</div>
					</div>
				)}
			</div>
		);
	}
};

export default IdentityVerificationHome;
