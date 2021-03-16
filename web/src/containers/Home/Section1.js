import React from 'react';
import classnames from 'classnames';
import { ReactSVG } from 'react-svg';
import STRINGS from '../../config/localizedStrings';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { ArrowDownOutlined } from '@ant-design/icons';
import { CurrencyCard } from './CurrencyCard';

const BUTTONS_CLASSES = ['buttons-section--button', ...FLEX_CENTER_CLASSES];
const CurrencyList = [
	{
		_id: '000001',
		currency: 'BTC/USD',
		upDown: -3.39,
		count: '54428.14',
		volume: '3,043,461,882',
	},
	{
		_id: '000002',
		currency: 'ETH/USDT',
		upDown: +3.4,
		count: '1754.14',
		volume: '3,043,461,882',
	},
	{
		_id: '000003',
		currency: 'EOS/USDT',
		upDown: -1.39,
		count: '3.8684',
		volume: '3,043,461,882',
	},
	{
		_id: '000004',
		currency: 'BCH/USDT',
		upDown: -6.39,
		count: '518.81',
		volume: '3,043,461,882',
	},
];
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
				<div className="container">
					<CurrencyCard CurrencyList={CurrencyList} />
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

				{/*<div className="bg-shape-1">
                    <img itemID="bounce-slow" className="viewable opacity-1"
                         src="https://hollaex.com/img/5a4a21de0ddd02419bb99326/2413945/upload-c09dbf77-00eb-4ab6-849d-4a4100eee001.jpg"/>
                </div>*/}
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
