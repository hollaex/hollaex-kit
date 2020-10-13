import React from "react";
import icons from 'config/icons';
import { DEFAULT_LANGUAGE } from 'config/constants';

const config = {
  defaultLanguage: DEFAULT_LANGUAGE,
  icons,
}

const ProjectConfig = React.createContext("appConfig")

export { ProjectConfig }

export default config;