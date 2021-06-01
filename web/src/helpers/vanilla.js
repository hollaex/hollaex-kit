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
