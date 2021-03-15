import React from 'react';
import MessageDisplay from './MessageDisplay';
import withConfig from 'components/ConfigProvider/withConfig';

export default withConfig(
	({ icons: ICONS, iconId, iconPath, success = true, ...rest }) => {
		return (
			<MessageDisplay
				iconId={iconId ? iconId : success ? 'CHECK' : 'RED_WARNING'}
				iconPath={
					iconPath ? iconPath : success ? ICONS.CHECK : ICONS.RED_WARNING
				}
				{...rest}
			/>
		);
	}
);
