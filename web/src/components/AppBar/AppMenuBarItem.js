import React from 'react';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';
import { Element } from 'craftjs';
import { uniqueId } from 'lodash';
import { useNode } from 'craftjs';

export const ConnectorSide = ({ children }) => {
	const {
		connectors: { connect },
	} = useNode();
	return (
		<div
			ref={connect}
			className={classnames('app-menu-bar-content d-flex text_overflow')}
		>
			{children}
		</div>
	);
};

const AppMenuBarItem = ({ path, isActive, onClick, stringId }) => {
	return (
		<Element id={uniqueId()} is={ConnectorSide} canvas>
			<span
				className={classnames('', {
					'active-menu': isActive,
				})}
			>
				<div
					onClick={() => onClick(path)}
					className="app-menu-bar-content-item d-flex text_overflow"
				>
					<EditWrapper stringId={stringId}>{STRINGS[stringId]}</EditWrapper>
				</div>
			</span>
		</Element>
	);
};

export default AppMenuBarItem;
