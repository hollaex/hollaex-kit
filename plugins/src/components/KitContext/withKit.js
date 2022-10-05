import React from 'react';
import { KitContext } from './index';

const withKit = (mapContextToProps) => (Component) => {
  return (props) => (
    <KitContext.Consumer>
      {(context) => (
        <Component
          {...props}
          {...mapContextToProps(context, props)}
        />
      )}
    </KitContext.Consumer>
  );
};

export default withKit;
