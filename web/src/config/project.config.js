import React from "react";

const config = {
  DEFAULT_LANGUAGE: process.env.REACT_APP_DEFAULT_LANGUAGE || 'en',
}

const ProjectConfig = React.createContext("appConfig")

export { ProjectConfig }

export default config;