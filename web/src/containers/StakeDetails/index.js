import React, { Fragment } from 'react';
import { isMobile } from 'react-device-detect';
import Desktop from './DesktopStakeDetails';
import Mobile from 'containers/Stake/MobileStake';

const Index = () => {
	return <Fragment>{isMobile ? <Mobile /> : <Desktop />}</Fragment>;
};

export default Index;
