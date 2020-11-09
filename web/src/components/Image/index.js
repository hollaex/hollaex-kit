import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { EditWrapper } from 'components';
import { isBackgroundIcon } from 'utils/icon';

const Image = ({
	icon,
	iconId,
	alt,
	wrapperClassName,
	imageWrapperClassName,
	svgWrapperClassName,
	stringId,
}) => {
	const useSvg = icon.indexOf('.svg') > 0;
	const isBackground = isBackgroundIcon(iconId);

	if (isBackground) {
		return (
			<div
				className={wrapperClassName}
				style={{ backgroundImage: `url(${icon})` }}
			/>
		);
	}

	return (
		<EditWrapper iconId={iconId} stringId={stringId}>
			{icon && useSvg && (
				<ReactSVG
					path={icon}
					wrapperClassName={classnames(wrapperClassName, svgWrapperClassName)}
				/>
			)}
			{icon && !useSvg && (
				<img
					src={icon}
					alt={alt}
					className={classnames(wrapperClassName, imageWrapperClassName)}
				/>
			)}
		</EditWrapper>
	);
};

Image.defaultProps = {
	icon: '',
	iconId: '',
	stringId: '',
	alt: '',
	wrapperClassName: '',
	imageWrapperClassName: '',
	svgWrapperClassName: '',
};

export default Image;
