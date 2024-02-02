// eslint-disable-next-line
import { ERROR_TOP_LEVEL_ELEMENT_NO_ID, useEffectOnce } from '@craftjs/utils';
// eslint-disable-next-line
import React, { useState } from 'react';
import invariant from 'tiny-invariant';
import { NodeElement } from './NodeElement';
import { useInternalNode } from './useInternalNode';
import { useInternalEditor } from '../editor/useInternalEditor';
export const defaultElementProps = {
	is: 'div',
	canvas: false,
	custom: {},
	hidden: false,
};
export const elementPropToNodeData = {
	is: 'type',
	canvas: 'isCanvas',
};
export function Element({ id, children, ...elementProps }) {
	const { is } = {
		...defaultElementProps,
		...elementProps,
	};
	const { query, actions } = useInternalEditor();
	const { node, inNodeContext } = useInternalNode((node) => ({
		node: {
			id: node.id,
			data: node.data,
		},
	}));
	// const [linkedNodeId, setLinkedNodeId] = useState(null);
	let linkedNodeId;
	// useEffectOnce(() => {
	invariant(!!id, ERROR_TOP_LEVEL_ELEMENT_NO_ID);
	const { id: nodeId, data } = node;
	if (inNodeContext) {
		const existingNode =
			data.linkedNodes &&
			data.linkedNodes[id] &&
			query.node(data.linkedNodes[id]).get();
		// Render existing linked Node if it already exists (and is the same type as the JSX)
		if (existingNode && existingNode.data.type === is) {
			linkedNodeId = existingNode.id;
		} else {
			// otherwise, create and render a new linked Node
			const linkedElement = React.createElement(
				Element,
				elementProps,
				children
			);
			const tree = query.parseReactElement(linkedElement).toNodeTree();
			linkedNodeId = tree.rootNodeId;
			actions.history.ignore().addLinkedNodeFromTree(tree, nodeId, id);
		}
		// setLinkedNodeId(linkedNodeId);
	}
	// });
	return linkedNodeId
		? React.createElement(NodeElement, { id: linkedNodeId })
		: null;
}
//# sourceMappingURL=Element.js.map
