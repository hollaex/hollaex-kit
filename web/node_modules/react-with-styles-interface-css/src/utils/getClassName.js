/**
 * Construct a class name.
 *
 * namespace {String} Used to construct unique class names.
 * styleName {String} Name identifying the specific style.
 *
 * Return the class name.
 */
export default function getClassName(namespace, styleName) {
  const namespaceSegment = namespace.length > 0 ? `${namespace}__` : '';
  return `${namespaceSegment}${styleName}`;
}
