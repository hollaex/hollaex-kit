import flat from 'array.prototype.flat';
import globalCache from 'global-cache';

import { GLOBAL_CACHE_KEY } from './utils/constants';
import getClassName from './utils/getClassName';
import separateStyles from './utils/separateStyles';

/**
 * Function required as part of the react-with-styles interface. Parses the styles provided by
 * react-with-styles to produce class names based on the style name and optionally the namespace if
 * available.
 *
 * stylesObject {Object} The styles object passed to withStyles.
 *
 * Return an object mapping style names to class names.
 */
function create(stylesObject) {
  const stylesToClasses = {};
  const styleNames = Object.keys(stylesObject);
  const sharedState = globalCache.get(GLOBAL_CACHE_KEY) || {};
  const { namespace = '' } = sharedState;
  styleNames.forEach((styleName) => {
    const className = getClassName(namespace, styleName);
    stylesToClasses[styleName] = className;
  });
  return stylesToClasses;
}

/**
 * Process styles to be consumed by a component.
 *
 * stylesArray {Array} Array of the following: values returned by create, plain JavaScript objects
 * representing inline styles, or arrays thereof.
 *
 * Return an object with optional className and style properties to be spread on a component.
 */
function resolve(stylesArray) {
  const flattenedStyles = flat(stylesArray, Infinity);
  const { classNames, hasInlineStyles, inlineStyles } = separateStyles(flattenedStyles);
  const specificClassNames = classNames.map((name, index) => `${name} ${name}_${index + 1}`);
  const className = specificClassNames.join(' ');

  const result = { className };
  if (hasInlineStyles) result.style = inlineStyles;
  return result;
}

export default { create, resolve };
