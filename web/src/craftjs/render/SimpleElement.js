import React from 'react';
import { useNode } from '../hooks/useNode';
export const SimpleElement = ({ render }) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return typeof render.type === 'string'
		? connect(drag(React.cloneElement(render)))
		: render;
};
//# sourceMappingURL=SimpleElement.js.map
