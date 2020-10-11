import React from 'react';
import { Button } from '../';
import STRINGS from '../../config/localizedStrings';
import ReactSVG from 'react-svg';
import { EditWrapper } from 'components';

const MessageDisplay = ({
	text,
	onClick,
	buttonLabel = STRINGS["CLOSE_TEXT"],
	iconPath,
	iconId,
}) => (
	<div className="success_display-wrapper d-flex align-content-between flex-wrap flex-column">
		<div className="success_display-content d-flex flex-column align-self-center flex-wrap justify-content-center align-items-center">
			<EditWrapper iconId={iconId}>
				<ReactSVG path={iconPath} wrapperClassName="success_display-content-image" />
			</EditWrapper>
			<div className="success_display-content-text">{text}</div>
		</div>
		<Button label={buttonLabel} onClick={onClick} />
	</div>
);

export default MessageDisplay;
