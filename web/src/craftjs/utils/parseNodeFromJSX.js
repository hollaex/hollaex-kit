import React, { Fragment } from 'react';
import { createNode } from './createNode';
export function parseNodeFromJSX(jsx, normalize) {
	let element = jsx;
	if (typeof element === 'string') {
		element = React.createElement(Fragment, {}, element);
	}
	let actualType = element.type;
	return createNode(
		{
			data: {
				type: actualType,
				props: { ...element.props },
			},
		},
		(node) => {
			if (normalize) {
				normalize(node, element);
			}
		}
	);
}
//# sourceMappingURL=parseNodeFromJSX.js.map
