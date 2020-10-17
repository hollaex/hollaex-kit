import React from 'react';
import classnames from 'classnames';
import ICONS from 'config/icons';
import ReactSVG from 'react-svg';
import { EditWrapper } from 'components';

const renderCheckboxImage = (checked) => (
	<ReactSVG
		path={checked ? ICONS["SUCCESS_BLACK"] : ICONS["SECURE"]}
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
	children
}) => (
	<div className="checkbutton-wrapper">
		<div
			className={classnames(
				'checkbutton-input-wrapper',
				'd-flex',
				'align-items-center',
				{ pointer: !!onClick }
			)}
			onClick={onCheck(disabled, onClick, checked)}
		>
			{loading ? (
				<div className="checkbutton-input-wrapper--loader" />
			) : (
				renderCheckboxImage(checked, disabled)
			)}
			<span className="checkbutton-input-wrapper--label">
				<EditWrapper stringId={stringId}>
					{label}
				</EditWrapper>
			</span>
		</div>
		{children && <div className="checkbutton-content-wrapper">{children}</div>}
	</div>
);

export default CheckboxButton;
