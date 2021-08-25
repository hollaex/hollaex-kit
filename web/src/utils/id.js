export const generateGlobalId = (pluginName = 'UNKNOWN_PLUGIN') => (
	key = 'UNKNOWN_KEY'
) => `RC_${pluginName.toUpperCase()}_${key.toUpperCase()}`;
