export const generateGlobalId = (pluginName = 'UNKNOWN_PLUGIN') => (
	key = 'UNKNOWN_KEY'
) => `RC_${pluginName.toUpperCase()}_${key.toUpperCase()}`;

export const generateDynamicTarget = (
	pluginName = 'UNKNOWN_PLUGIN',
	type = 'page'
) => {
	const name = pluginName.toUpperCase();
	switch (type) {
		case 'page':
		default:
			return `REMOTE_ROUTE__${name}`;
	}
};
