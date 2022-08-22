import React, { Fragment } from 'react';
import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const NoVerifiedAccount = ({ icons: ICONS, type = 'deposit' }) => {
	const typeId =
		type === 'deposit'
			? 'FIAT.UNVERIFIED.DEPOSIT'
			: 'FIAT.UNVERIFIED.WITHDRAWAL';
	return (
		<Fragment>
			<IconTitle
				text={STRINGS['FIAT.UNVERIFIED.TITLE']}
				stringId="FIAT.UNVERIFIED.TITLE"
				iconId="FIAT_KYC"
				iconPath={ICONS['FIAT_KYC']}
				className="flex-direction-column"
			/>
			<div className="text-align-center py-4">
				<EditWrapper stringId="FIAT.UNVERIFIED.TEXT,FIAT.UNVERIFIED.DEPOSIT,FIAT.UNVERIFIED.WITHDRAWAL">
					{STRINGS.formatString(
						STRINGS['FIAT.UNVERIFIED.TEXT'],
						STRINGS[typeId]
					)}
				</EditWrapper>
			</div>
		</Fragment>
	);
};

export default withConfig(NoVerifiedAccount);
