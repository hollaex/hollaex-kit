import React from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import STRINGS from '../../config/localizedStrings';

import { FLEX_CENTER_CLASSES, FEATURES_ICONS } from '../../config/constants';

const BUTTONS_CLASSES = ['buttons-section--button', ...FLEX_CENTER_CLASSES];

const generateCardsContentFromStrings = (strings) => {
	return [
		{
			icon: FEATURES_ICONS.PRO_TRADING,
			title: STRINGS["HOME.SECTION_3_CARD_1_TITLE"],
			text: STRINGS["HOME.SECTION_3_CARD_1_TEXT"]
		},
		{
			icon: FEATURES_ICONS.PAYMENT,
			title: STRINGS["HOME.SECTION_3_CARD_2_TITLE"],
			text: STRINGS["HOME.SECTION_3_CARD_2_TEXT"]
		},
		{
			icon: FEATURES_ICONS.SECURITY,
			title: STRINGS["HOME.SECTION_3_CARD_3_TITLE"],
			text: STRINGS["HOME.SECTION_3_CARD_3_TEXT"]
		},
		{
			icon: FEATURES_ICONS.REPORTING,
			title: STRINGS["HOME.SECTION_3_CARD_4_TITLE"],
			text: STRINGS["HOME.SECTION_3_CARD_4_TEXT"]
		},
		{
			icon: FEATURES_ICONS.SUPPORT,
			title: STRINGS["HOME.SECTION_3_CARD_5_TITLE"],
			text: STRINGS["HOME.SECTION_3_CARD_5_TEXT"]
		},
		{
			icon: FEATURES_ICONS.LEGAL,
			title: STRINGS["HOME.SECTION_3_CARD_6_TITLE"],
			text: STRINGS["HOME.SECTION_3_CARD_6_TEXT"]
		}
	];
};

const Card = ({ icon, title, text }) => (
	<div className={classnames(...FLEX_CENTER_CLASSES, 'home-card-container')}>
		<ReactSVG
			path={icon}
			className="home-card-icon"
			wrapperClassName="home-card-icon-wrapper"
		/>
		<div
			className={classnames(
				'd-flex',
				'flex-column',
				'f-1',
				'home-card-text-container'
			)}
		>
			<div className="home-card-title f-0">{title}</div>
			<div className="home-card-text f-1">{text}</div>
		</div>
	</div>
);

const Section = ({ style, onClickDemo, token }) => (
	<div
		className={classnames(
			...FLEX_CENTER_CLASSES,
			'flex-column',
			'features-container'
		)}
		style={style}
	>
		<div className="text-center features-title">
			{STRINGS["HOME.SECTION_3_TITLE"]}
		</div>
		<div className="features-card_container d-flex flex-wrap justify-content-center">
			{generateCardsContentFromStrings(STRINGS).map((card, index) => (
				<Card {...card} key={index} />
			))}
		</div>
		<div className={classnames('buttons-section', ...FLEX_CENTER_CLASSES)}>
			{
				<div
					className={classnames(...BUTTONS_CLASSES, { pointer: onClickDemo })}
					onClick={onClickDemo}
				>
					{STRINGS["HOME.SECTION_3_BUTTON_1"]}
				</div>
			}
			{/*!token && (
				<div
					className={classnames(...BUTTONS_CLASSES, 'contrast', {
						pointer: onClickRegister
					})}
					onClick={onClickRegister}
				>
					{STRINGS["REGISTER_TEXT"]}
				</div>
			)*/}
		</div>
	</div>
);

export default Section;
