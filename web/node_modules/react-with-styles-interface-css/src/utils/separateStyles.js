// This function takes an array of styles and separates them into styles that
// are handled by Aphrodite and inline styles.
function separateStyles(stylesArray) {
  const classNames = [];

  // Since determining if an Object is empty requires collecting all of its
  // keys, and we want the best performance in this code because we are in the
  // render path, we are going to do a little bookkeeping ourselves.
  let hasInlineStyles = false;
  const inlineStyles = {};

  // This is run on potentially every node in the tree when rendering, where
  // performance is critical. Normally we would prefer using `forEach`, but
  // old-fashioned for loops are faster so that's what we have chosen here.
  for (let i = 0; i < stylesArray.length; i++) { // eslint-disable-line no-plusplus
    const style = stylesArray[i];

    // If this  style is falsy, we just want to disregard it. This allows for
    // syntax like:
    //
    //   css(isFoo && styles.foo)
    if (style) {
      if (typeof style === 'string') {
        classNames.push(style);
      } else {
        Object.assign(inlineStyles, style);
        hasInlineStyles = true;
      }
    }
  }

  return {
    classNames,
    hasInlineStyles,
    inlineStyles,
  };
}

export default separateStyles;
