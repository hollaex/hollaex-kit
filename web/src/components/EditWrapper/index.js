import React, { Fragment } from 'react';
import { string, array, object, bool } from 'prop-types';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import { STATIC_ICONS } from 'config/icons';
import { convertToFormatted } from 'utils/string';

const defaultRender = (children) => <Fragment>{children}</Fragment>;
const defaultRenderWrapper = (children) => <div>{children}</div>;

const EditWrapper = ({
	children,
	stringId,
	iconId,
	position,
	style,
	reverse,
	sectionId,
	backgroundId,
	configId,
	render = defaultRender,
	strings,
	renderWrapper = defaultRenderWrapper,
}) => {
	const [x = 5, y = 0] = position;
	const triggerStyles = {
		transform: `translate(${x}px, ${y}px)`,
	};

	const getConvertedString = (elements) =>
		elements && Array.isArray(elements)
			? elements.map((element, index) => {
					if (Array.isArray(render) && typeof render[index] === 'function') {
						return render[index](convertToFormatted(element));
					} else if (typeof render === 'function') {
						return render(convertToFormatted(element));
					} else {
						return defaultRender(convertToFormatted(element));
					}
			  })
			: render(convertToFormatted(elements));

	return (
		<div
			className={classnames('edit-wrapper__container', { reverse: reverse })}
			style={style}
		>
			{renderWrapper(getConvertedString(strings || children))}
			<div className="edit-wrapper__icons-container" style={triggerStyles}>
				{stringId && (
					<div className="edit-wrapper__icon-wrapper" data-string-id={stringId}>
						<ReactSVG
							src={STATIC_ICONS['EDIT_STRING']}
							className="edit-wrapper__icon"
						/>
					</div>
				)}
				{iconId && (
					<div className="edit-wrapper__icon-wrapper" data-icon-id={iconId}>
						<ReactSVG
							src={STATIC_ICONS['OPERATOR_EDIT_ICON']}
							className="edit-wrapper__icon"
						/>
					</div>
				)}
				{sectionId && (
					<div
						className="edit-wrapper__icon-wrapper large"
						data-section-id={sectionId}
					>
						<ReactSVG
							src={STATIC_ICONS['EDIT_SECTION']}
							className="edit-wrapper__icon"
						/>
					</div>
				)}
				{configId && (
					<div
						className="edit-wrapper__icon-wrapper medium"
						data-config-id={configId}
					>
						<ReactSVG
							src={STATIC_ICONS['EDIT_SECTION']}
							className="edit-wrapper__icon"
						/>
					</div>
				)}
				{backgroundId && (
					<div
						className="edit-wrapper__icon-wrapper"
						data-icon-id={backgroundId}
					>
						<ReactSVG
							src={STATIC_ICONS['EDIT_BACKGROUND']}
							className="edit-wrapper__icon"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

EditWrapper.propTypes = {
	stringId: string,
	iconId: string,
	position: array,
	style: object,
	reverse: bool,
};

EditWrapper.defaultProps = {
	stringId: '',
	iconId: '',
	position: [],
	style: {},
	reverse: false,
};

export default EditWrapper;
