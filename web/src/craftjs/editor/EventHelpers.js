export function EventHelpers(state, eventType) {
	const event = state.events[eventType];
	return {
		contains(id) {
			return event.has(id);
		},
		isEmpty() {
			return this.all().length === 0;
		},
		first() {
			const values = this.all();
			return values[0];
		},
		last() {
			const values = this.all();
			return values[values.length - 1];
		},
		all() {
			return Array.from(event);
		},
		size() {
			return this.all().length;
		},
		at(i) {
			return this.all()[i];
		},
		raw() {
			return event;
		},
	};
}
//# sourceMappingURL=EventHelpers.js.map
