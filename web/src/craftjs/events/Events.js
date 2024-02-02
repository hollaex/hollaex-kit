import React, { useContext, useMemo } from 'react';
import { EventHandlerContext } from './EventContext';
import { RenderEditorIndicator } from './RenderEditorIndicator';
import { EditorContext } from '../editor/EditorContext';
export const Events = ({ children }) => {
	const store = useContext(EditorContext);
	const handler = useMemo(() => store.query.getOptions().handlers(store), [
		store,
	]);
	if (!handler) {
		return null;
	}
	return React.createElement(
		EventHandlerContext.Provider,
		{ value: handler },
		React.createElement(RenderEditorIndicator, null),
		children
	);
};
//# sourceMappingURL=Events.js.map
