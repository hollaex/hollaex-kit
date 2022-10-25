import React, { Component } from 'react';
import { KitContext } from './index';

class KitContextProvider extends Component {
  render() {
    const { children, ...rest } = this.props;
    return (
      <KitContext.Provider value={rest}>
        {children}
      </KitContext.Provider>
    );
  }
}

export default KitContextProvider;
