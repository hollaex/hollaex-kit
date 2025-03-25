import React, { Fragment } from 'react';
import { isMobile } from 'react-device-detect';
import DesktopStake from './DesktopStake';
import MobileStake from './MobileStake';

const Index = ({ isFromWallet = false }) => {
	return (
		<Fragment>
			{isMobile ? (
				<MobileStake isFromWallet={isFromWallet} />
			) : (
				<DesktopStake />
			)}
		</Fragment>
	);
};

export default Index;
