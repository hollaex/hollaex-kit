import React from 'react';
import { ICONS } from '../../config/constants';
import MessageDisplay from './MessageDisplay';

export default ({ success = true, ...rest }) => (
	<MessageDisplay
		iconId={success ? "CHECK": "RED_WARNING"}
		iconPath={success ? ICONS.CHECK : ICONS.RED_WARNING}
		{...rest}
	/>
);
