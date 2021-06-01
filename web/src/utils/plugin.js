import { render } from 'react-dom';

export const injectPlugin = (component, targetId) => {
	const targetElement = document.getElementById(targetId);
	if (targetElement) {
		render(component, targetElement);
	} else {
		console.error(`There is no DOM element with the id ${targetId}`);
	}
};
