import { render } from 'react-dom';

// This is to test remote plugins injection
/*export const PLUGINS = [
	{
		target: 'REMOTE_COMPONENT__BANK_VERIFICATION_HOME',
		src: '/bank_verification_home.js',
		props: [
			{ key: 'user', store_key: 'user' },
			{ key: 'handleBack', store_key: 'handleBack' },
			{ key: 'setActivePageContent', store_key: 'setActivePageContent' },
			{ key: 'icons', store_key: 'icons' },
			{ key: 'MAX_NUMBER_BANKS', store_key: 'MAX_NUMBER_BANKS' },
		],
	},
	{
		target: 'REMOTE_COMPONENT__BANK_VERIFICATION',
		src: '/bank_verification.js',
		props: [
			{ key: 'user', store_key: 'user' },
			{ key: 'openContactForm', store_key: 'openContactForm' },
			{ key: 'setActivePageContent', store_key: 'setActivePageContent' },
			{ key: 'handleBack', store_key: 'handleBack' },
			{ key: 'moveToNextStep', store_key: 'moveToNextStep' },
			{ key: 'icons', store_key: 'icons' },
			{ key: 'verifyBankData', store_key: 'verifyBankData' },
			{ key: 'getErrorLocalized', store_key: 'getErrorLocalized' },
			{ key: 'maxLength', store_key: 'maxLength' },
			{ key: 'required', store_key: 'required' },
		],
	},
];*/

export const injectPlugin = (component, targetId) => {
	const targetElement = document.getElementById(targetId);
	if (targetElement) {
		render(component, targetElement);
		console.info(
			`Remote component successfully injected into DOM element ${targetId}`
		);
	} else {
		console.error(`There is no DOM element with the id ${targetId}`);
	}
};
