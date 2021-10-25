import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ErrorContent = ({ onOkay, action, icons: ICONS }) => {
	return (
		<Fragment>
			<div className="dialog-content bottom pt-4">
				<IconTitle
					iconPath={ICONS['STAKING_ERROR']}
					iconId="STAKING_ERROR"
					stringId="STAKE.ERROR_TITLE,STAKE.ERROR_SUBTITLE"
					text={STRINGS.formatString(STRINGS['STAKE.ERROR_TITLE'], action)}
					textType="stake_popup__title"
					underline={false}
					className="w-100 py-4"
				/>

				<div>
					<EditWrapper stringId="STAKE.OKAY" />
					<Button label={STRINGS['STAKE.OKAY']} onClick={onOkay} />
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(ErrorContent);
