import merge from 'lodash.merge';
import defaultThemes from 'config/colors';

const ThemeBuilder = (activeTheme, themes) => {
  const element = document.documentElement;
  const mergedThemes = merge({}, defaultThemes, themes)

  if (element) {
    const themeData = mergedThemes[activeTheme];
    if (themeData && Object.keys(themeData)) {
      Object.keys(themeData).forEach((name) => {
        element.style.setProperty(`--${name}`, themeData[name])
      });
    }
  }
}

export default ThemeBuilder;