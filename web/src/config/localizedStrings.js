import LocalizedStrings from 'react-localization';
import nestedContent from './lang';
import flatten from 'flat';
import merge from 'lodash.merge';
import commonContent from './lang/common';

const options = { safe: true };

const content = {};
Object.entries(nestedContent).forEach(([langKey, langContent]) => {
	const mergedContent = merge({}, langContent, commonContent);
	content[langKey] = flatten(mergedContent, options);
});

const strings = new LocalizedStrings(content);

export { content };
export default strings;
