import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import invariant from 'tiny-invariant';
export const resolveComponent = (resolver, comp) => {
	const componentName = comp.name || comp.displayName;
	const getNameInResolver = () => {
		if (resolver[componentName]) {
			return componentName;
		}
		for (let i = 0; i < Object.keys(resolver).length; i++) {
			const name = Object.keys(resolver)[i];
			const fn = resolver[name];
			if (fn === comp) {
				return name;
			}
		}
		if (typeof comp === 'string') {
			return comp;
		}
	};
	const resolvedName = getNameInResolver();
	invariant(
		resolvedName,
		ERROR_NOT_IN_RESOLVER.replace('%node_type%', componentName)
	);
	return resolvedName;
};
//# sourceMappingURL=resolveComponent.js.map
