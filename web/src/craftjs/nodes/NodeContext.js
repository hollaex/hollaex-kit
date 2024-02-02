import React from 'react';
export const NodeContext = React.createContext(null);
export const NodeProvider = ({ id, related = false, children }) => {
	return React.createElement(
		NodeContext.Provider,
		{ value: { id, related } },
		children
	);
};
//# sourceMappingURL=NodeContext.js.map
