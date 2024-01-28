import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { useNode } from '@craftjs/core';

const Connector = ({ children }) => {
	const {
		connectors: { connect },
	} = useNode();
	return (
		<div ref={connect} style={{ minHeight: 20, minWidth: 20 }}>
			{children}
		</div>
	);
};

export default Connector;
