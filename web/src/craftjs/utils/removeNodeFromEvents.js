export const removeNodeFromEvents = (state, nodeId) =>
	Object.keys(state.events).forEach((key) => {
		const eventSet = state.events[key];
		if (eventSet && eventSet.has && eventSet.has(nodeId)) {
			state.events[key] = new Set(
				Array.from(eventSet).filter((id) => nodeId !== id)
			);
		}
	});
//# sourceMappingURL=removeNodeFromEvents.js.map
