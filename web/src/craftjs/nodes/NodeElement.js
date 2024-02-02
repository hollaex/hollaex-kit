import React from 'react';
import { NodeProvider } from './NodeContext';
import { RenderNodeToElement } from '../render/RenderNode';
export const NodeElement = ({ id, render }) => {
	return React.createElement(
		NodeProvider,
		{ id: id },
		React.createElement(RenderNodeToElement, { render: render })
	);
};
//# sourceMappingURL=NodeElement.js.map
