import globalCache from 'global-cache';

import { GLOBAL_CACHE_KEY } from './constants';

/**
 * Register max specificity for generating CSS
 *
 * maxSpecificity {Integer} max specificity to use for generating stylesheets,
 *   ie how many _N classes get generated
 */
export default function registerMaxSpecificity(maxSpecificity) {
  const sharedState = globalCache.get(GLOBAL_CACHE_KEY);
  if (!sharedState) {
    globalCache.set(GLOBAL_CACHE_KEY, { maxSpecificity });
  } else {
    sharedState.maxSpecificity = maxSpecificity;
  }
}
