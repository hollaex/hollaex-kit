const clearFileInput = (controlledInputNode) => {
	try {
		controlledInputNode.value = null;
	} catch (e) {
		console.error(e);
	}
	if (controlledInputNode.value) {
		controlledInputNode.parentNode.replaceChild(
			controlledInputNode.cloneNode(true),
			controlledInputNode
		);
	}
};

export const clearFileInputById = (id) => {
	clearFileInput(document.getElementById(id));
};

export const drawFavIcon = (url) => {
	const head = document.getElementsByTagName('head')[0];
	const linkEl = document.createElement('link');

	linkEl.type = 'image/x-icon';
	linkEl.rel = 'icon';
	linkEl.href = url;

	// remove existing favicons
	const links = head.getElementsByTagName('link');

	for (let i = links.length; --i >= 0; ) {
		if (/\bicon\b/i.test(links[i].getAttribute('rel'))) {
			head.removeChild(links[i]);
		}
	}

	head.appendChild(linkEl);
};
