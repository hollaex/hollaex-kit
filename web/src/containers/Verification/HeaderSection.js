import React from 'react';
import { EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';

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
				<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.TITLE">
					{
						STRINGS[
							'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.TITLE'
						]
					}
				</EditWrapper>
				<ul className="header_title-list">
					<li>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_1">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_1'
								]
							}
						</EditWrapper>
					</li>
					<li>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_2">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_2'
								]
							}
						</EditWrapper>
					</li>
					<li>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_3">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.LIST_ITEM_3'
								]
							}
						</EditWrapper>
					</li>
				</ul>
			</div>
		}
		importantContent={
			<div>
				<div className="id-warning">
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.WARNING_3">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.WARNING_3'
							]
						}
					</EditWrapper>
				</div>
				<div>
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.WARNING_1">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.ID_SECTION.WARNING_1'
							]
						}
					</EditWrapper>
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
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_1">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_1'
							]
						}
					</EditWrapper>
					<br />
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_2">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_2'
							]
						}
					</EditWrapper>
					<br />
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_3">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_3'
							]
						}
					</EditWrapper>
					<br />
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_4">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_1_TEXT_4'
							]
						}
					</EditWrapper>
				</div>
				<div className="header_title-content">
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_TITLE">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_TITLE'
							]
						}
					</EditWrapper>
					<ul className="header_title-list">
						<li>
							<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_1">
								{
									STRINGS[
										'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_1'
									]
								}
							</EditWrapper>
						</li>
						<li>
							<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_2">
								{
									STRINGS[
										'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_2'
									]
								}
							</EditWrapper>
						</li>
						<li>
							<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_3">
								{
									STRINGS[
										'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.SECTION_2_LIST_ITEM_3'
									]
								}
							</EditWrapper>
						</li>
					</ul>
				</div>
			</div>
		}
		importantContent={
			<div className="id-warning">
				<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.WARNING">
					{
						STRINGS[
							'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.POR.WARNING'
						]
					}
				</EditWrapper>
			</div>
		}
	/>
);

export const SelfieWithPhotoId = () => (
	<ChildrenContainer
		mainContent={
			<div>
				<div className="header_title-content w-75">
					<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INFO_TEXT">
						{
							STRINGS[
								'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INFO_TEXT'
							]
						}
					</EditWrapper>
				</div>
				<div className="header_title-content">
					<div className="text-uppercase">
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.REQUIRED">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.REQUIRED'
								]
							}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_1">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_1'
								]
							}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_2">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_2'
								]
							}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_3">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_3'
								]
							}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_4">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_4'
								]
							}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_5">
							{
								STRINGS[
									'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.INSTRUCTION_5'
								]
							}
						</EditWrapper>
					</div>
				</div>
			</div>
		}
		importantContent={
			<div className="id-warning mt-3">
				<EditWrapper stringId="USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.WARNING">
					{
						STRINGS[
							'USER_VERIFICATION.ID_DOCUMENTS_FORM.INFORMATION.SELFIE.WARNING'
						]
					}
				</EditWrapper>
			</div>
		}
	/>
);
