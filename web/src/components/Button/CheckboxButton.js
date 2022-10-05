import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';
import Image from 'components/Image';

const renderCheckboxImage = (checked, ICONS = {}, customCheckIcon) => (
	<Image
		iconId={checked ? 'SUCCESS_BLACK' : 'SECURE'}
		icon={
			checked
				? customCheckIcon
					? ICONS[customCheckIcon]
					: ICONS['SUCCESS_BLACK']
				: ICONS['SECURE']
		}
		wrapperClassName="checkbutton-input-wrapper--image"
	/>
);

const onCheck = (disabled, onClick = () => {}, checked) => () => {
	if (!disabled) {
		onClick(!checked);
	}
};

const CheckboxButton = ({
	name = 'CheckboxButton',
	checked = false,
	onClick,
	stringId,
	label = 'Label',
	disabled = false,
	loading = false,
	children,
	icons,
	customCheckIcon = '',
}) => (
	<div className="checkbutton-wrapper">
		<div
			className={classnames(
				'checkbutton-input-wrapper',
				'd-flex',
				'align-items-center',
				'mdc-button',
				'mdc-button--unelevated',
				{ pointer: !!onClick }
			)}
			onClick={onCheck(disabled, onClick, checked)}
		>
			{loading ? (
				<div className="checkbutton-input-wrapper--loader" />
			) : (
				renderCheckboxImage(checked, icons, customCheckIcon)
			)}
			<span className="checkbutton-input-wrapper--label">
				<EditWrapper stringId={stringId}>{label}</EditWrapper>
			</span>
		</div>
		{children && <div className="checkbutton-content-wrapper">{children}</div>}
	</div>
);

export default CheckboxButton;
