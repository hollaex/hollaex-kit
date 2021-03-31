import React from 'react';
import classnames from 'classnames';

export const MobileBarWrapper = ({ className, children }) => {
	return <div className={classnames('mobile-bar', className)}>{children}</div>;
};

MobileBarWrapper.defaultProps = {
	className: '',
};
