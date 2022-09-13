import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
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
	width,
	height,
	showUpload,
	beforeInjection = () => {},
}) => {
	const useSvg = icon.indexOf('.svg') > 0;
	const isBackground = isBackgroundIcon(iconId);

	if (isBackground) {
		return (
			<div
				className={classnames(
					wrapperClassName,
					'background-size-contain',
					'h-100'
				)}
				style={{ backgroundImage: `url(${icon})`, width, height }}
			/>
		);
	}

	return (
		<EditWrapper iconId={showUpload ? iconId : ''} stringId={stringId}>
			{icon && useSvg && (
				<ReactSVG
					src={icon}
					className={classnames(wrapperClassName, svgWrapperClassName)}
					style={{
						width,
						height,
					}}
					beforeInjection={beforeInjection}
					fallback={() => (
						<img
							src={icon}
							alt={alt}
							width={width}
							height={height}
							className={classnames(wrapperClassName, svgWrapperClassName)}
						/>
					)}
				/>
			)}
			{icon && !useSvg && (
				<img
					src={icon}
					alt={alt}
					style={{
						width,
						height,
					}}
					className={classnames(
						wrapperClassName,
						imageWrapperClassName,
						'object-fit-contain'
					)}
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
	showUpload: true,
};

export default Image;
