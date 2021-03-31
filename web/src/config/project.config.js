import icons from 'config/icons';
import color from 'config/colors';
import {
	DEFAULT_LANGUAGE,
	THEME_DEFAULT,
	DEFAULT_LANDING_SECTIONS as sections,
} from 'config/constants';

const config = {
	icons,
	color,
	sections,
	defaults: {
		theme: THEME_DEFAULT,
		language: DEFAULT_LANGUAGE,
	},
};

export default config;
