export const TOGGLE_TOOL = 'TOGGLE_TOOL';
export const INITIALIZE_TOOLS = 'INITIALIZE_TOOLS';

const TOOLS_LS_KEY = 'tools';
const RGL_LS_KEY = 'rgl-layout';

export const storeTools = (tools = {}) => {
	localStorage.setItem(TOOLS_LS_KEY, JSON.stringify(tools));
};

export const initializeTools = () => {
	const tools = JSON.parse(localStorage.getItem(TOOLS_LS_KEY) || '{}');

	return {
		type: INITIALIZE_TOOLS,
		payload: tools,
	};
};

export const toggleTool = (key) => {
	return {
		type: TOGGLE_TOOL,
		payload: {
			key,
		},
	};
};

export const getLayout = () => {
	return JSON.parse(localStorage.getItem(RGL_LS_KEY) || '[]');
};

export const storeLayout = (layout = []) => {
	localStorage.setItem(RGL_LS_KEY, JSON.stringify(layout));
};
