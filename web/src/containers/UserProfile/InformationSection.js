import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';

export const InformationSection = ({ text, onChangeValue, onChangeText }) => (
	<div className="information_section d-flex flex-column">
		{text && (
			<div className="information_text-wrapper d-flex align-items-center">
				<ClockCircleOutlined
					style={{ fontSize: '16px' }}
					className="information_svg secondary-text"
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
