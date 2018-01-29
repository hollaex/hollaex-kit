import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FieldWrapper, { FieldContent } from './FieldWrapper';
import { ActionNotification } from '../../';
import { ICONS } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

export const renderCopy = (text, component) => {
	return (
		<CopyToClipboard text={text}>
			<ActionNotification
				status="information"
				text={STRINGS.COPY_TEXT}
				iconPath={ICONS.COPY_NEW}
				className="copy-wrapper"
			/>
		</CopyToClipboard>
	);
};

const DumbField = ({ label, value, allowCopy = false, ...rest }) => {
	const props = {
		label,
		hideUnderline: true
	};

	return (
		<FieldWrapper className="dumb-field-wrapper" {...rest}>
			<FieldContent {...props}>
				{value}
				{value && allowCopy && renderCopy(value)}
			</FieldContent>
		</FieldWrapper>
	);
};

export default DumbField;
