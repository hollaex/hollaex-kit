import React from 'react';
import { Button } from '../';
import STRINGS from '../../config/localizedStrings';
import Image from 'components/Image';
import { EditWrapper } from 'components';

const MessageDisplay = ({
	stringId,
	text,
	onClick,
	buttonLabel = STRINGS['CLOSE_TEXT'],
	iconPath,
	iconId,
}) => (
	<div className="success_display-wrapper d-flex align-content-between flex-wrap flex-column">
		<div className="success_display-content d-flex flex-column align-self-center flex-wrap justify-content-center align-items-center">
			<Image
				iconId={iconId}
				icon={iconPath}
				wrapperClassName="success_display-content-image"
			/>
			<div className="success_display-content-text">
				<EditWrapper stringId={stringId}>{text}</EditWrapper>
			</div>
		</div>
		<Button label={buttonLabel} onClick={onClick} />
	</div>
);

export default MessageDisplay;
