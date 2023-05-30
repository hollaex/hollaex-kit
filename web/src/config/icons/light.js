import flatten from 'flat';

const options = { safe: true, delimiter: '_' };
const nestedIcons = {
	EXCHANGE: {
		LOADER: '/assets/light-spinner.gif',
		BOARDING_IMAGE: '/assets/background.png',
		LANDING_PAGE: '/assets/images/hollaex-background.png',
	},

	SUMMARY: {
		LEVEL_1: '/assets/summary/level-1.png',
		LEVEL_2: '/assets/summary/level-2.png',
		LEVEL_3: '/assets/summary/level-3.png',
		LEVEL_4: '/assets/summary/level-4.png',
	},

	DEMO_LOGIN_ICON: '/assets/icons/demo-login-icon-light.svg',
	CANCEL_WITHDRAW: '/assets/icons/cancel-withdraw-light-02.svg',

	CHECK: '/assets/images/Orderbook scrolling-01.svg',
	VERIFICATION_SENT: '/assets/images/resend-email-light.svg',

	STAKING_AMOUNT_MODAL: '/assets/stake/staking-modal-background-light.jpg',
	STAKING_PERIOD_ITEM:
		'/assets/stake/staking-period-option-background-light.png',
	STAKING_MODAL_BACKGROUND: '/assets/stake/modal_background_light.png',
	STAKING_SUCCESSFUL_MESSAGE: '/assets/stake/stake-unstake-light.png',
	STAKING_PANEL_BACKGROUND: '/assets/stake/stake-unstake-light.png',
	STAKING_BACKGROUND: '/assets/stake/stake-background-light.png',
};

const icons = flatten(nestedIcons, options);

export default icons;
