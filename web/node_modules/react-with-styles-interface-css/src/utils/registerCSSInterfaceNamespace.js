import globalCache from 'global-cache';

import { GLOBAL_CACHE_KEY } from './constants';

/**
 * Register a namespace to use for constructing unique class names.
 *
 * CSSInterfaceNamespace {String} The namespace to be used. e.g. Name of the project
 */
export default function registerCSSInterfaceNamespace(CSSInterfaceNamespace) {
  const sharedState = globalCache.get(GLOBAL_CACHE_KEY);
  if (!sharedState) {
    globalCache.set(GLOBAL_CACHE_KEY, { namespace: CSSInterfaceNamespace });
  } else {
    sharedState.namespace = CSSInterfaceNamespace;
  }
}
