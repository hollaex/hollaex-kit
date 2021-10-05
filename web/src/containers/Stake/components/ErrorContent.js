import React, { Fragment } from 'react';
import { EditWrapper, Button, IconTitle } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ErrorContent = ({ onOkay, action, icons: ICONS }) => {
	const headerContent = {
		width: '100%',
		height: '100%',
		display: 'flex',
		'flex-direction': 'column',
		'justify-content': 'space-between',
	};

	return (
		<Fragment>
			<div className="dialog-content bottom">
				<div style={headerContent}>
					<IconTitle
						iconPath={ICONS['STAKING_ERROR']}
						iconId="STAKING_ERROR"
						stringId="STAKE.ERROR_TITLE,STAKE.ERROR_SUBTITLE"
						text={STRINGS.formatString(STRINGS['STAKE.ERROR_TITLE'], action)}
						textType="title"
						underline={false}
						className="w-100"
						subtitle={STRINGS['STAKE.ERROR_SUBTITLE']}
					/>

					<div>
						<EditWrapper stringId="STAKE.OKAY" />
						<Button label={STRINGS['STAKE.OKAY']} onClick={onOkay} />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withConfig(ErrorContent);
