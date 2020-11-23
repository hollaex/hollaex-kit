import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';

import { MobileBarWrapper } from '.';
import { ICONS } from '../../config/constants';

export const MobileBarBack = ({ onBackClick, wrapperClassName, className }) => {
	return (
		<MobileBarWrapper className="d-flex align-items-center">
			<div
				className={classnames('close-dialog', className)}
				onClick={onBackClick}
			>
				<ReactSVG
					path={ICONS.ARROW_ARROW}
					wrapperClassName={classnames('bar-icon-back', wrapperClassName)}
				/>
			</div>
		</MobileBarWrapper>
	);
};

MobileBarBack.defaultProps = {
	onBackClick: () => {},
	wrapperClassName: '',
	className: '',
};
