import React from 'react';
import classnames from 'classnames';
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
				useSvg={true}
			/>
		</CopyToClipboard>
	);
};

const DumbField = ({
	label,
	value,
	className = '',
	allowCopy = false,
	...rest
}) => {
	const props = {
		label,
		hideUnderline: true
	};

	return (
		<FieldWrapper
			className={classnames('dumb-field-wrapper', className)}
			{...rest}
		>
			<FieldContent {...props}>
				{value}
				{value && allowCopy && renderCopy(value)}
			</FieldContent>
		</FieldWrapper>
	);
};

export default DumbField;
