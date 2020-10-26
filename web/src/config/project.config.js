import React from "react";
import icons from 'config/icons';
import color from 'config/colors';
import { DEFAULT_LANGUAGE } from 'config/constants';

const config = {
  defaultLanguage: DEFAULT_LANGUAGE,
  icons,
  color,
}

const ProjectConfig = React.createContext("appConfig")

export { ProjectConfig }

export default config;