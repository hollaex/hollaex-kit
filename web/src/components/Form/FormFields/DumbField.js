import React from 'react';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FieldWrapper, { FieldContent } from './FieldWrapper';
import { ActionNotification } from '../../';
import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

export const renderCopy = (text, onCopy, component) => {
	return (
		<CopyToClipboard text={text}>
			<ActionNotification
				status="information"
				stringId="COPY_TEXT"
				text={STRINGS['COPY_TEXT']}
				iconId="COPY_NEW"
				iconPath={ICONS['COPY_NEW']}
				className="copy-wrapper"
				onClick={onCopy}
			/>
		</CopyToClipboard>
	);
};

const DumbField = ({
	label,
	value,
	className = '',
	allowCopy = false,
	onCopy,
	copyOnClick = false,
	...rest
}) => {
	const props = {
		label,
		hideUnderline: true,
	};

	return (
		<FieldWrapper
			className={classnames('dumb-field-wrapper', className)}
			{...rest}
		>
			<FieldContent {...props}>
				<div className="d-flex justify-content-between">
					{copyOnClick ? (
						<CopyToClipboard text={value}>
							<div className="pointer address-line" onClick={onCopy}>
								{value}
							</div>
						</CopyToClipboard>
					) : (
						value
					)}
					{value && allowCopy && renderCopy(value, onCopy)}
				</div>
			</FieldContent>
		</FieldWrapper>
	);
};

export default DumbField;
