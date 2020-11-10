import React from 'react';
import Ionicon from 'react-ionicons';
import STRINGS from '../../config/localizedStrings';

export const InformationSection = ({ text, onChangeValue, onChangeText }) => (
	<div className="information_section d-flex flex-column">
		{text && (
			<div className="information_text-wrapper d-flex align-items-center">
				<Ionicon
					icon="ios-time-outline"
					fontSize="16px"
					color="white"
					className="information_svg"
				/>
				<div className="information_text-text">{text}</div>
			</div>
		)}
		{onChangeValue && (
			<div
				className="pointer text-uppercase information_change"
				onClick={onChangeValue}
			>
				{onChangeText || STRINGS['USER_VERIFICATION.CHANGE_VALUE']}
			</div>
		)}
	</div>
);
