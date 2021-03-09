import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import STRINGS from '../../config/localizedStrings';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { ArrowDownOutlined } from '@ant-design/icons';
import { Account } from '../index';
import MarketList from '../TradeTabs/components/MarketList';

const BUTTONS_CLASSES = ['buttons-section--button', ...FLEX_CENTER_CLASSES];

const Section1 = ({
	style = {},
	onClickScrollTo = () => {},
	onClickLearnMore,
	token,
	icons: ICONS,
}) => {
	return (
		<>
			<div className={'section-one-container'}>
				<div className={'section-one-header'}>
					{STRINGS['HOME.SECTION_1_TITLE']} {/*Buy & sell Crypto in minutes*/}
				</div>
				<div className={'section-one-text'}>
					{/*Join the world's largest crypto exchange*/}
					<div> {STRINGS['HOME.SECTION_1_TEXT_1']} </div>{' '}
					<div> {STRINGS['HOME.SECTION_1_TEXT_2']} </div>{' '}
				</div>
				<div className={'section-one-text'}>
					{' '}
					<EditWrapper iconId="ARROW_ARROW">
						<div
							className={classnames('pointer', 'flex-0', 'scroll-button')}
							onClick={onClickScrollTo}
						>
							<ReactSVG src={ICONS['ARROW_ARROW']} />{' '}
						</div>{' '}
					</EditWrapper>{' '}
				</div>
				<div className={'section-one-text mt-20'}>
					<button
						onClick={onClickScrollTo}
						className={'btn btn-lg themeBgColor btn-cus-reg'}
					>
						Explore More
					</button>
					<br />
					<ArrowDownOutlined />
				</div>
			</div>

			{/*<div className={classnames('f-1', ...FLEX_CENTER_CLASSES, 'flex-column')}>
                <div className="home-title text-capitalize">
                    {' '}
                    {STRINGS['HOME.SECTION_1_TITLE']}{' '}
                </div>
                {' '}
                <div className="text-section text-center">
                    <div> {STRINGS['HOME.SECTION_1_TEXT_1']} </div>
                    {' '}
                    <div> {STRINGS['HOME.SECTION_1_TEXT_2']} </div>
                    {' '}
                </div>
                {' '}
                <div className={classnames('buttons-section', ...FLEX_CENTER_CLASSES)}>
                    <div
                        className={classnames(...BUTTONS_CLASSES, {
                            pointer: onClickLearnMore,
                        })}
                        onClick={onClickLearnMore}
                    >
                        {STRINGS['HOME.SECTION_1_BUTTON_1']}{' '}
                    </div>
                    {' '}
                    {}{' '}
                </div>
                {' '}
            </div>
            {' '}
            <EditWrapper iconId="ARROW_ARROW">
                <div
                    className={classnames('pointer', 'flex-0', 'scroll-button')}
                    onClick={onClickScrollTo}
                >
                    <ReactSVG src={ICONS['ARROW_ARROW']}/>{' '}
                </div>
                {' '}
            </EditWrapper>{' '}*/}
		</>
	);
};

export default withConfig(Section1);
