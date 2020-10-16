import defaultIcons from 'config/icons';

export const getIconByKey = (key, content = defaultIcons) => {
  return content[key];
}

export const getLogo = (theme, { logo_path, logo_black_path }, { EXCHANGE_LOGO_LIGHT, EXCHANGE_LOGO_DARK }) => {
  if (theme === 'white') {
    return EXCHANGE_LOGO_LIGHT || logo_path
  } else {
    return EXCHANGE_LOGO_DARK || logo_black_path
  }
}