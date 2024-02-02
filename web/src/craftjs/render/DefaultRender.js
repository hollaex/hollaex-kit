import React, { useMemo } from 'react';
import { SimpleElement } from './SimpleElement';
import { NodeElement } from '../nodes/NodeElement';
import { useInternalNode } from '../nodes/useInternalNode';
export const DefaultRender = () => {
	const { type, props, nodes, hydrationTimestamp } = useInternalNode(
		(node) => ({
			type: node.data.type,
			props: node.data.props,
			nodes: node.data.nodes,
			hydrationTimestamp: node._hydrationTimestamp,
		})
	);
	return useMemo(() => {
		let children = props.children;
		if (nodes && nodes.length > 0) {
			children = React.createElement(
				React.Fragment,
				null,
				nodes.map((id) => React.createElement(NodeElement, { id: id, key: id }))
			);
		}
		const render = React.createElement(type, props, children);
		if (typeof type == 'string') {
			return React.createElement(SimpleElement, { render: render });
		}
		return render;
		// eslint-disable-next-line  react-hooks/exhaustive-deps
	}, [type, props, hydrationTimestamp, nodes]);
};
//# sourceMappingURL=DefaultRender.js.map
