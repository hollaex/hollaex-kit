import React from 'react';
import { LevelsBlock } from './LevelsBlock';

const Limits = ({ fetching, fetched, data, error, verification_level }) => {
  if (fetching || !fetched) {
    return <div />
  } else {
    return (
      <LevelsBlock userLevel={verification_level} limits={data} />
    )
  }
}

export const LevelSection = ({ children, limits, verification_level }) => {
  return (
    <div>
      {children}
      <Limits {...limits} verification_level={verification_level} />
    </div>
  );
}
