import React from 'react';
import { useNode } from '../useNode';
export function connectNode(collect) {
	return function (WrappedComponent) {
		return (props) => {
			const node = useNode(collect);
			return React.createElement(WrappedComponent, { ...node, ...props });
		};
	};
}
//# sourceMappingURL=connectNode.js.map
