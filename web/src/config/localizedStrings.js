import LocalizedStrings from 'react-localization';

import en from './lang/en';
import ko from './lang/ko';
import fa from './lang/fa';
import ar from './lang/ar';

const strings = new LocalizedStrings({
	en,
	ko,
	fa,
	ar
});

export default strings;
