import {
	useCollector,
	wrapConnectorHooks,
	ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT,
} from '@craftjs/utils';
import { useContext, useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { EditorContext } from './EditorContext';
import { useEventHandler } from '../events/EventContext';
export function useInternalEditor(collector) {
	const handler = useEventHandler();
	const store = useContext(EditorContext);
	invariant(store, ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT);
	const collected = useCollector(store, collector);
	const connectorsUsage = useMemo(
		() => handler && handler.createConnectorsUsage(),
		[handler]
	);
	useEffect(() => {
		connectorsUsage.register();
		return () => {
			connectorsUsage.cleanup();
		};
	}, [connectorsUsage]);
	const connectors = useMemo(
		() => connectorsUsage && wrapConnectorHooks(connectorsUsage.connectors),
		[connectorsUsage]
	);
	return {
		...collected,
		connectors,
		inContext: !!store,
		store,
	};
}
//# sourceMappingURL=useInternalEditor.js.map
