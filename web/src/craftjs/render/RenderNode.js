import React from 'react';
import { DefaultRender } from './DefaultRender';
import { useInternalEditor } from '../editor/useInternalEditor';
import { useInternalNode } from '../nodes/useInternalNode';
export const RenderNodeToElement = ({ render }) => {
	const { hidden } = useInternalNode((node) => ({
		hidden: node.data.hidden,
	}));
	const { onRender } = useInternalEditor((state) => ({
		onRender: state.options.onRender,
	}));
	// don't display the node since it's hidden
	if (hidden) {
		return null;
	}
	return React.createElement(onRender, {
		render: render || React.createElement(DefaultRender, null),
	});
};
//# sourceMappingURL=RenderNode.js.map
