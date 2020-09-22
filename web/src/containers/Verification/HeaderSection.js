import React from 'react';

import STRINGS from '../../config/localizedStrings';

const ChildrenContainer = ({ mainContent, importantContent }) => (
	<div>
		{mainContent}
		{importantContent && (
			<div className="important_information">{importantContent}</div>
		)}
	</div>
);

export const IdentificationFormSection = () => (
	<ChildrenContainer
		mainContent={
			<div className="header_title-content">
				{
					STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.TITLE"]
				}
				<ul className="header_title-list">
					<li>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_1"]
						}
					</li>
					<li>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_2"]
						}
					</li>
					<li>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_3"]
						}
					</li>
				</ul>
			</div>
		}
		importantContent={
			<div>
				<div className="id-warning">
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.WARNING_3"]
					}
				</div>
				<div>
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.WARNING_1"]
					}
				</div>
			</div>
		}
	/>
);

export const PORSection = () => (
	<ChildrenContainer
		mainContent={
			<div>
				<div className="header_title-content">
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_1"]
					}
					<br />
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_2"]
					}
					<br />
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_3"]
					}
					<br />
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_4"]
					}
				</div>
				<div className="header_title-content">
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_TITLE"]
					}
					<ul className="header_title-list">
						<li>
							{
								STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_1"]
							}
						</li>
						<li>
							{
								STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_2"]
							}
						</li>
						<li>
							{
								STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_3"]
							}
						</li>
					</ul>
				</div>
			</div>
		}
		importantContent={
			<div className="id-warning">
				{STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.WARNING"]}
			</div>
		}
	/>
);

export const SelfieWithPhotoId = () => (
	<ChildrenContainer
		mainContent={
			<div>
				<div className="header_title-content w-75">
					{
						STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INFO_TEXT"]
					}
				</div>
				<div className="header_title-content">
					<div className="text-uppercase">
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.REQUIRED"]
						}
					</div>
					<div>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_1"]
						}
					</div>
					<div>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_2"]
						}
					</div>
					<div>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_3"]
						}
					</div>
					<div>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_4"]
						}
					</div>
					<div>
						{
							STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_5"]
						}
					</div>
				</div>
			</div>
		}
		importantContent={
			<div className="id-warning mt-3">
				{
					STRINGS["USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.WARNING"]
				}
			</div>
		}
	/>
);
