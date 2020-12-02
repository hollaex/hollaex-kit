import LocalizedStrings from 'react-localization';

import en from './lang/en';
import ko from './lang/ko';
import fa from './lang/fa';
import ar from './lang/ar';

export const content = {
	en,
	ko,
	fa,
	ar,
};

const strings = new LocalizedStrings(content);

export default strings;
