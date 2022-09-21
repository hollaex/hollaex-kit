import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "store";
import Form from './Form';
import { KitContextProvider } from "components/KitContext";

class App extends Component {
  render() {
    const { children: defaultView, ...rest } = this.props;
    return (
      <Provider store={store}>
        <KitContextProvider {...rest} defaultView={defaultView}>
          <Form />
        </KitContextProvider>
      </Provider>
    );
  }
};

export { App };