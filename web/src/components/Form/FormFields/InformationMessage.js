import React from 'react';
import classnames from 'classnames';

const InformationMessage = ({
	iconPath,
	text,
	absolute,
	className,
	position,
}) => (
	<div
		className={classnames(
			'information_message',
			'd-flex',
			'justify-content-start',
			'align-items-center',
			{ absolute },
			className,
			position
		)}
	>
		<img
			src={iconPath}
			alt={text}
			className={classnames('information_message-image')}
		/>
		{text && (
			<span className={classnames('information_message-text')}>{text}</span>
		)}
	</div>
);

export default InformationMessage;
