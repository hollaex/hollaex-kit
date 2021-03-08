import React from 'react';
import STRINGS from '../../config/localizedStrings';

export const SubHeader = () => (
	<div className={'section-one-container'}>
		<div className={'section-one-header'}>
			{STRINGS['HOME.SECTION_1_TITLE']} {/*Buy & sell Crypto in minutes*/}
		</div>
		<div className={'section-one-text'}>
			{/*Join the world's largest crypto exchange*/}
			<div> {STRINGS['HOME.SECTION_1_TEXT_1']} </div>{' '}
			<div> {STRINGS['HOME.SECTION_1_TEXT_2']} </div>{' '}
		</div>
		<div className={'section-one-text mt-20'}>
			<button href={'/signup'} className={'btn btn-lg btn-warning btn-cus-reg'}>
				Register Now
			</button>
		</div>
	</div>
);
