import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import withConfig from 'components/ConfigProvider/withConfig';
import Image from 'components/Image';
import { isLightColor, getColorFromTheme, BASE_BACKGROUND } from 'utils/color';

const Loader = ({
	relative,
	className,
	background,
	icons: ICONS,
	activeTheme,
	color,
}) => {
	const isLight = isLightColor(
		getColorFromTheme(BASE_BACKGROUND, activeTheme, color)
	);

	return (
		<div
			className={classnames(
				'd-flex',
				'justify-content-center',
				'align-items-center',
				{
					loader_wrapper: !relative,
					loader_wrapper_relative: relative,
				},
				className
			)}
		>
			<div className={classnames({ loader_background: background })} />
			<Image
				wrapperClassName="loader"
				iconId={isLight ? 'LOADER_LIGHT' : 'LOADER_DARK'}
				icon={isLight ? ICONS['LOADER_LIGHT'] : ICONS['LOADER_DARK']}
			/>
		</div>
	);
};

Loader.defaultProps = {
	relative: false,
	background: true,
	className: '',
};

const mapStateToProps = ({
	app: { theme: activeTheme, constants: { color = {} } = {} },
}) => ({
	activeTheme,
	color,
});

export default connect(mapStateToProps)(withConfig(Loader));
