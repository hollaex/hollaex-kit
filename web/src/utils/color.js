import Color from 'color';
import light from 'config/colors/light';

export const getColorByKey = (key, content = light) => {
  return content[key];
}

export const calculateThemes = (themes) => {
  const calculatedThemes = {}

  Object.entries(themes).forEach(([themeKey, themeData]) => {
    calculatedThemes[themeKey] = pushCalculatedColors(themeData)
  })

  return calculatedThemes;
}

const pushCalculatedColors = (themeData) => {

  const calculatedColors = {
    'calculated_trading_buying-related-text': Color(themeData['trading_buying-related-elements']).isLight() ? 'black' : 'white',
    'calculated_trading_selling-related-text': Color(themeData['trading_selling-related-elements']).isLight() ? 'black' : 'white',
    'calculated_base_modal-overlay': Color(themeData['base_wallet-sidebar-and-popup']).alpha(0.75).string(),
  }

  return {...themeData, ...calculatedColors};
}

const allowedColorKeys = Object.keys(light);

export const filterThemes = (themes) => {
  const filteredThemes = {}

  Object.entries(themes).forEach(([themeKey, themeData]) => {
    filteredThemes[themeKey] = filterTheme(themeData)
  })

  return filteredThemes;
}

export const filterTheme = (theme) => {
  const filteredTheme = Object.keys(theme)
    .filter(key => allowedColorKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = theme[key];
      return obj;
    }, {});

  return filteredTheme;
}
