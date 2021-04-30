import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';

import { MobileBarWrapper } from '.';
import withConfig from 'components/ConfigProvider/withConfig';

const MobileBarBack = ({
	onBackClick,
	wrapperClassName,
	className,
	icons: ICONS,
}) => {
	return (
		<MobileBarWrapper className="d-flex align-items-center">
			<div
				className={classnames('close-dialog', className)}
				onClick={onBackClick}
			>
				<ReactSVG
					src={ICONS['ARROW_ARROW']}
					className={classnames('bar-icon-back', wrapperClassName)}
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

export default withConfig(MobileBarBack);
