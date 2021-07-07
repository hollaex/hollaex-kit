import LocalizedStrings from 'react-localization';
import nestedContent from './lang';
import flatten from 'flat';

const options = { safe: true };

const content = {};
Object.entries(nestedContent).forEach(([langKey, langContent]) => {
	content[langKey] = flatten(langContent, options);
});

const strings = new LocalizedStrings(content);

export { content };
export default strings;
