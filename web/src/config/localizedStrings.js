import LocalizedStrings from 'react-localization';

import en from './lang/en';
import de from './lang/de';
import ko from './lang/ko';
import fa from './lang/fa';
import ar from './lang/ar';
import fr from './lang/fr';
import es from './lang/es';
import ja from './lang/ja';
import vi from './lang/vi';
import id from './lang/id';
import zh from './lang/zh';
import pt from './lang/pt';

export const content = {
	en,
	de,
	ko,
	ja,
	fa,
	ar,
	fr,
	es,
	vi,
	id,
	zh,
	pt,
};

const strings = new LocalizedStrings(content);

export default strings;
