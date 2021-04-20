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

/*HTML INJECTION*/

const extractAttributes = (node) => {
	if (node && node.tagName) {
		const tag = node.tagName.toLowerCase();
		const attributes = {};
		Array.from(node.attributes).forEach(({ name, value }) => {
			if (node.hasAttributes() && node.hasAttribute(name)) {
				attributes[name] = value;
			}
		});

		if (tag === 'script' && node.innerHTML) {
			attributes['text'] = node.innerHTML;
		} else if (node.innerHTML) {
			attributes['innerHTML'] = node.innerHTML;
		}

		return [tag, attributes];
	}
	return [];
};

const stringToHTML = (string) => {
	const dom = document.createElement('div');
	dom.innerHTML = string;
	return dom;
};

export const injectHTML = (injected_html = {}, target) => {
	try {
		const string = injected_html && injected_html[target];
		if (string) {
			const html = stringToHTML(string);
			const nodeList = html.childNodes;

			const elements = [];
			Array.from(nodeList).forEach((node) => {
				const [tag, attributes] = extractAttributes(node);
				if (tag && attributes) {
					elements.push({ target, tag, attributes });
				}
			});

			addElements(elements, target);
		}
	} catch (err) {
		console.error(err);
	}
};
