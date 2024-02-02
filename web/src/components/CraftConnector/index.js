import React from 'react';
import { useNode } from 'craftjs';

const Connector = ({ children }) => {
	const {
		connectors: { connect, drag },
	} = useNode();
	return (
		<div
			ref={(ref) => connect(drag(ref))}
			style={{ minHeight: 20, minWidth: 20 }}
		>
			{children}
		</div>
	);
};

export default Connector;
