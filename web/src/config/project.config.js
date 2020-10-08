import React from "react";
import icons from 'config/icons';

const config = {
  DEFAULT_LANGUAGE: process.env.REACT_APP_DEFAULT_LANGUAGE || 'en',
  icons,
}

const ProjectConfig = React.createContext("appConfig")

export { ProjectConfig }

export default config;