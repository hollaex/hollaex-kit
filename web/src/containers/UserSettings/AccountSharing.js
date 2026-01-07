import React, { useState } from 'react';
import { withRouter } from 'react-router';

import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { IconTitle, EditWrapper } from 'components';

const AccountSharing = ({ icons: ICONS = {}, router }) => {
	const [openDangerZone, setOpenDangerZone] = useState(false);

	const handleSubmit = () => {
		setOpenDangerZone(false);
		router.push('/account-sharing');
	};

	return (
		<div className="settings-form-wrapper account-share-tab">
			<div className="settings-form">
				<IconTitle
					stringId="ACCOUNT_SHARING.TITLE"
					text={STRINGS['ACCOUNT_SHARING.TITLE']}
					textType="title"
					iconPath={ICONS['ACCOUNT_SHARING_HEADER_ICON']}
					iconId="ACCOUNT_SHARING_HEADER_ICON"
				/>
				<div className="py-3 mt-3 d-flex flex-column align-items-start">
					<EditWrapper stringId="ACCOUNT_SHARING.ACCOUNT_SHARING_DESCRIPTION">
						{STRINGS['ACCOUNT_SHARING.ACCOUNT_SHARING_DESCRIPTION']}
					</EditWrapper>
					{!openDangerZone ? (
						<div className="mt-2">
							<EditWrapper stringId="ACCOUNT_SHARING.SHARE_ACCOUNT_LABEL">
								{STRINGS.formatString(
									STRINGS['ACCOUNT_SHARING.SHARE_ACCOUNT_LABEL'],
									<span
										className="underline-text pointer"
										onClick={() => setOpenDangerZone(true)}
									>
										{STRINGS['USER_SETTINGS.DELETE_ACCOUNT.ACCESS.LINK']}
									</span>
								)}
							</EditWrapper>
						</div>
					) : (
						<div className="danger-zone p-4 important-text mt-5 w-100">
							<div className="danger-zone-title">
								<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.TITLE">
									<span className="bold">
										{
											STRINGS[
												'USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.TITLE'
											]
										}
										:
									</span>
								</EditWrapper>
								<EditWrapper stringId="ACCOUNT_SHARING.TITLE">
									{STRINGS['ACCOUNT_SHARING.TITLE']}
								</EditWrapper>
							</div>
							<div className="secondary-text py-2">
								<EditWrapper stringId="ACCOUNT_SHARING.ACCOUNT_DANGER_ZONE_DESCRIPTION">
									{STRINGS['ACCOUNT_SHARING.ACCOUNT_DANGER_ZONE_DESCRIPTION']}
								</EditWrapper>
							</div>
							<div className="d-flex gap-1">
								<div
									onClick={() => setOpenDangerZone(false)}
									className="underline-text pointer"
								>
									<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.CANCEL">
										{
											STRINGS[
												'USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.CANCEL'
											]
										}
									</EditWrapper>
								</div>

								<div className="underline-text pointer" onClick={handleSubmit}>
									<EditWrapper stringId="USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.PROCEED">
										{
											STRINGS[
												'USER_SETTINGS.DELETE_ACCOUNT.ACCESS.DANGER_ZONE.PROCEED'
											]
										}
									</EditWrapper>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default withRouter(withConfig(AccountSharing));
