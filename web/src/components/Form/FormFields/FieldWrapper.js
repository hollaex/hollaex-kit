import React, { Component, Fragment } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';

import { STATIC_ICONS } from 'config/icons';
import { ActionNotification } from '../../';
import { getErrorLocalized } from '../../../utils/errors';
import { EditWrapper } from 'components';

export const FieldContent = ({
	stringId,
	label = '',
	valid = false,
	hasValue = false,
	focused = false,
	children,
	hideUnderline = false,
	contentClassName = '',
	hideCheck = false,
	outlineClassName = '',
	displayError,
	error,
	ishorizontalfield = false,
	dateFieldClassName,
	warning,
}) => {
	return (
		<div>
			<div className={classnames({ 'field-label-wrapper': ishorizontalfield })}>
				<div className="d-flex">
					{label && (
						<div className="field-label">
							{label}
							{warning && (
								<div className="d-flex align-items-baseline field_warning_wrapper">
									<ExclamationCircleFilled className="field_warning_icon" />
									<div className="field_warning_text">{warning}</div>
								</div>
							)}
						</div>
					)}
					<EditWrapper stringId={stringId} />
				</div>
				<div className={classnames('field-content')}>
					<div
						className={classnames(
							'field-children',
							{ valid, custom: hideUnderline },
							contentClassName,
							{
								'input-box-field':
									ishorizontalfield && dateFieldClassName === '',
							}
						)}
					>
						{children}
						{!hideCheck && valid && hasValue && (
							<ReactSVG
								src={STATIC_ICONS.BLACK_CHECK}
								className="field-valid"
							/>
						)}
					</div>
					{!hideUnderline && (
						<span
							className={classnames('field-content-outline', outlineClassName, {
								focused,
							})}
						/>
					)}
				</div>
			</div>
			<div className="field-label-wrapper">
				{ishorizontalfield ? (
					<Fragment>
						<div className="field-label"></div>
						<FieldError displayError={displayError} error={error} />
					</Fragment>
				) : null}
			</div>
		</div>
	);
};

export const FieldError = ({ error, displayError, className, stringId }) => (
	<div
		className={classnames('field-error-content', className, {
			'field-error-hidden': !displayError,
		})}
	>
		{error && (
			<img
				src={STATIC_ICONS.RED_WARNING}
				className="field-error-icon"
				alt="error"
			/>
		)}
		{error && (
			<EditWrapper stringId={stringId}>
				<span className="field-error-text">{getErrorLocalized(error)}</span>
			</EditWrapper>
		)}
	</div>
);

class FieldWrapper extends Component {
	render() {
		const {
			children,
			label,
			warning,
			stringId,
			input: { value },
			meta: { active = false, error = '', touched = false, invalid = false },
			focused = false,
			fullWidth = false,
			visited = false,
			hideUnderline = false,
			className = '',
			onClick = () => {},
			notification,
			hideCheck = false,
			outlineClassName = '',
			ishorizontalfield,
		} = this.props;

		const displayError = !(active || focused) && (visited || touched) && error;
		const hasValue = value || value === false;
		return (
			<div
				className={classnames('field-wrapper', className, {
					error: displayError,
					inline: !fullWidth,
					'with-notification': !!notification,
					'field-valid': !invalid,
				})}
			>
				<FieldContent
					stringId={stringId}
					label={label}
					warning={warning}
					valid={!invalid}
					hasValue={hasValue}
					focused={active || focused}
					hideUnderline={hideUnderline}
					hideCheck={hideCheck}
					outlineClassName={outlineClassName}
					onClick={onClick}
					displayError={displayError}
					error={error}
					ishorizontalfield={ishorizontalfield}
					dateFieldClassName={className}
				>
					{children}
					{notification && typeof notification === 'object' && (
						<ActionNotification
							{...notification}
							className={classnames('pr-0 pl-0 no_bottom', {
								'with-tick-icon': fullWidth && !invalid && !hideCheck,
							})}
							showActionText={true}
						/>
					)}
				</FieldContent>
				{!ishorizontalfield ? (
					<FieldError displayError={displayError} error={error} />
				) : null}
			</div>
		);
	}
}

FieldWrapper.defaultProps = {
	meta: {},
	input: {
		value: '',
	},
};

export default FieldWrapper;
