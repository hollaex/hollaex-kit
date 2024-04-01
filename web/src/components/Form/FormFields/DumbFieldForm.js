import React from 'react';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FieldWrapper from './FieldWrapper';
import { ActionNotification } from 'components';
import { ICONS } from 'config/constants';
import STRINGS from 'config/localizedStrings';

export const renderCopy = (text, onCopy) => {
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
	input: { value },
	className = '',
	allowCopy = false,
	onCopy,
	copyOnClick = false,
	notification,
	...rest
}) => {
	const multipleNotification = notification && Array.isArray(notification);
	let notifications;

	if (multipleNotification) {
		notifications = [...notification];

		if (value && allowCopy) {
			notifications.push({
				stringId: 'COPY_TEXT',
				text: STRINGS['COPY_TEXT'],
				status: 'information',
				iconPath: ICONS['COPY_NEW'],
				iconId: 'COPY_NEW',
				className: 'copy-wrapper',
				useSvg: true,
				onClick: onCopy,
				renderWrapper: (children) => (
					<CopyToClipboard text={value}>{children}</CopyToClipboard>
				),
			});
		}
	}

	return (
		<FieldWrapper
			className={classnames('dumb-field-wrapper', className)}
			notification={notifications}
			{...rest}
		>
			<div className="d-flex justify-content-between">
				{copyOnClick ? (
					<CopyToClipboard text={value}>
						<div
							className={classnames(
								'pointer',
								'address-line',
								{ 'multi-action': multipleNotification },
								{ 'single-action': !multipleNotification && value && allowCopy }
							)}
							onClick={onCopy}
						>
							{value}
						</div>
					</CopyToClipboard>
				) : (
					value
				)}
				{!multipleNotification &&
					value &&
					allowCopy &&
					renderCopy(value, onCopy)}
			</div>
		</FieldWrapper>
	);
};

export default DumbField;
