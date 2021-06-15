import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import STRINGS from '../../config/localizedStrings';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';

const BUTTONS_CLASSES = ['buttons-section--button', ...FLEX_CENTER_CLASSES];

const Section1 = ({
	style = {},
	onClickScrollTo = () => {},
	onClickLearnMore,
	token,
	icons: ICONS,
}) => {
	return (
		<div
			className={classnames(
				...FLEX_CENTER_CLASSES,
				'flex-column',
				'section_1-content'
			)}
			style={style}
		>
			<div className={classnames('f-1', ...FLEX_CENTER_CLASSES, 'flex-column')}>
				<div className="home-title text-capitalize">
					{STRINGS['HOME.SECTION_1_TITLE']}
				</div>
				<div className="text-section text-center">
					<div>{STRINGS['HOME.SECTION_1_TEXT_1']}</div>
					<div>{STRINGS['HOME.SECTION_1_TEXT_2']}</div>
				</div>
				<div className={classnames('buttons-section', ...FLEX_CENTER_CLASSES)}>
					<div
						className={classnames(...BUTTONS_CLASSES, {
							pointer: onClickLearnMore,
						})}
						onClick={onClickLearnMore}
					>
						{STRINGS['HOME.SECTION_1_BUTTON_1']}
					</div>
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
			<EditWrapper iconId="ARROW_ARROW">
				<div
					className={classnames('pointer', 'flex-0', 'scroll-button')}
					onClick={onClickScrollTo}
				>
					<ReactSVG src={ICONS['ARROW_ARROW']} />
				</div>
			</EditWrapper>
		</div>
	);
};

export default withConfig(Section1);
