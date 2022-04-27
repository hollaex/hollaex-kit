import React, { Fragment } from 'react';
import { isMobile } from 'react-device-detect';
import DesktopStake from './DesktopStake';
import MobileStake from './MobileStake';

const Index = () => {
	return <Fragment>{isMobile ? <MobileStake /> : <DesktopStake />}</Fragment>;
};

export default Index;
