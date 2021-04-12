const createElement = (tag, attributes) => {
	const element = document.createElement(tag);

	Object.entries(attributes).forEach(([key, value]) => {
		element[key] = value;
	});

	return element;
};

const injectElement = (element, target) => {
	if (document && document[target]) {
		document[target].appendChild(element);
	} else {
		console.error(`Failed to inject element ${element} into ${target}`);
	}
};

const addElement = (tag, attributes, target) => {
	const element = createElement(tag, attributes);
	injectElement(element, target);
};

const filterElementsByTarget = (elements, filter) => {
	return elements.filter(({ target }) => !filter || target === filter);
};

export const addElements = (elements = [], targetFilter) => {
	const filteredElements = filterElementsByTarget(elements, targetFilter);
	filteredElements.forEach(({ tag, attributes, target }) => {
		addElement(tag, attributes, target);
	});
};
