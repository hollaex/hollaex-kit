import React from 'react';
import { isMobile } from 'react-device-detect';
import MobileDialog from './MobileDialog';
import DesktopDialog from './DesktopDialog';

const Dialog = (props) => {
	if (isMobile) {
		return <MobileDialog {...props} />;
	} else {
		return <DesktopDialog {...props} />;
	}
};

export default Dialog;
