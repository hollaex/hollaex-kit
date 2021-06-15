import React from 'react';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';

const BUTTONS_CLASSES = [
	'buttons-section--button',
	...FLEX_CENTER_CLASSES,
	'holla-button',
];

const MainSection = ({ style = {}, onClickTrade, onClickDemo }) => {
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
					<EditWrapper stringId="HOME.MAIN_TITLE">
						{STRINGS['HOME.MAIN_TITLE']}
					</EditWrapper>
				</div>
				<div className="text-section text-center">
					<EditWrapper stringId="HOME.MAIN_TEXT">
						{STRINGS['HOME.MAIN_TEXT']}
					</EditWrapper>
				</div>
				<div className={classnames('buttons-section', ...FLEX_CENTER_CLASSES)}>
					<div style={{ display: 'flex', alignSelf: 'center' }}>
						<EditWrapper stringId="HOME.VIEW_EXCHANGE" />
						<div
							className={classnames(
								...BUTTONS_CLASSES,
								'main-section_button_invert',
								'no-border',
								{
									pointer: onClickDemo,
								}
							)}
							onClick={onClickDemo}
						>
							{STRINGS['HOME.VIEW_EXCHANGE']}
						</div>
					</div>
					<div style={{ display: 'flex', alignSelf: 'center' }}>
						<EditWrapper stringId="HOME.TRADE_CRYPTO" />
						<div
							className={classnames(
								...BUTTONS_CLASSES,
								'main-section_button',
								'no-border',
								{
									pointer: onClickTrade,
								}
							)}
							onClick={onClickTrade}
						>
							{STRINGS['HOME.TRADE_CRYPTO']}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withConfig(MainSection);
