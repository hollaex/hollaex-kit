import { useMethods } from '@craftjs/utils';
import { ActionMethods } from './actions';
import { QueryMethods } from './query';
import { DefaultEventHandlers } from '../events';
export const editorInitialState = {
	nodes: {},
	events: {
		dragged: new Set(),
		selected: new Set(),
		hovered: new Set(),
	},
	indicator: null,
	options: {
		onNodesChange: () => null,
		onRender: ({ render }) => render,
		onBeforeMoveEnd: () => null,
		resolver: {},
		enabled: true,
		indicator: {
			error: 'red',
			success: 'rgb(98, 196, 98)',
		},
		handlers: (store) =>
			new DefaultEventHandlers({
				store,
				removeHoverOnMouseleave: false,
				isMultiSelectEnabled: (e) => !!e.metaKey,
			}),
		normalizeNodes: () => {},
	},
};
export const ActionMethodsWithConfig = {
	methods: ActionMethods,
	ignoreHistoryForActions: [
		'setDOM',
		'setNodeEvent',
		'selectNode',
		'clearEvents',
		'setOptions',
		'setIndicator',
	],
	normalizeHistory: (state) => {
		/**
		 * On every undo/redo, we remove events pointing to deleted Nodes
		 */
		Object.keys(state.events).forEach((eventName) => {
			const nodeIds = Array.from(state.events[eventName] || []);
			nodeIds.forEach((id) => {
				if (!state.nodes[id]) {
					state.events[eventName].delete(id);
				}
			});
		});
		// Remove any invalid node[nodeId].events
		// TODO(prev): it's really cumbersome to have to ensure state.events and state.nodes[nodeId].events are in sync
		// Find a way to make it so that once state.events is set, state.nodes[nodeId] automatically reflects that (maybe using proxies?)
		Object.keys(state.nodes).forEach((id) => {
			const node = state.nodes[id];
			Object.keys(node.events).forEach((eventName) => {
				const isEventActive = !!node.events[eventName];
				if (
					isEventActive &&
					state.events[eventName] &&
					!state.events[eventName].has(node.id)
				) {
					node.events[eventName] = false;
				}
			});
		});
	},
};
export const useEditorStore = (options, patchListener) => {
	// TODO: fix type
	return useMethods(
		ActionMethodsWithConfig,
		{
			...editorInitialState,
			options: {
				...editorInitialState.options,
				...options,
			},
		},
		QueryMethods,
		patchListener
	);
};
//# sourceMappingURL=store.js.map
