# Hollaex Plugin Starter

Hollaex plugin starter is a package with some pre-defined configurations out of the box to create custom plugins for the [Hollaex kit software](https://github.com/bitholla/hollaex-kit). These plugins can be installed on the fly to add features to your exchange.

Creating plugins has two different aspects, the server-side script and the client-side component.

# Client-side component

Client side codes in the plugins are actually nothing but a remote react component that is injected into the kit on the fly. We are using a package called [remote component](https://github.com/Paciolan/remote-component) to get a component by providing the url for that which is the address of the commonjs module bundle and add it to the kit using the smart target component.


## Smart Target component
To decide where to inject remote components, we are using the [smart target](https://github.com/bitholla/hollaex-kit/blob/master/web/src/components/SmartTarget/index.js) component in the kit.

Smart target is actually a react component with a unique target id that renders a remote bundle when the id matches.

Smart targets are also responsible for passing props to the remote components. These props are divided into two different categories.

### Common props
Common props are passed to all remote components within the smart target component. They include but not limited to strings, icons, generateId function, renderFields function to generate forms, store values, edit and config context.
You can always check the latest available common props for remote components by checking the [smart target](https://github.com/bitholla/hollaex-kit/blob/master/web/src/components/SmartTarget/index.js) component in codebase.

### Target specific props
Target specific props are passed to the smart target component from the parent component and may be different for each target.
To get the latest available target-specific props, you can check the parent component of each smart target component below:

- [New Page](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/routes.js#L240)
- Fiat Wallet
    - [Deposit](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Deposit/utils.js#L169)
    - [Withdraw](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Withdraw/form.js#L257)
- New Verification Tab
    - [Home](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Verification/index.js#L234)
    - [Page Content](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Verification/index.js#L256)
- Bank Verification Tab
    - [Home](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Verification/index.js#L355)
    - [Page Content](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Verification/index.js#L506)
- KYC Verification Tab
    - [Home](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Verification/index.js#L380)
    - [Page Content](https://github.com/bitholla/hollaex-kit/blob/8e617abf15c503e2e8483ffc5f4ae3e7befa4401/web/src/containers/Verification/index.js#L523)


## Targets

### Static Targets
  
- Verification Page Bank Tab
    - REMOTE_COMPONENT__BANK_VERIFICATION
    - REMOTE_COMPONENT__BANK_VERIFICATION_HOME
  
- Verification Page KYC Tab
    - REMOTE_COMPONENT__KYC_VERIFICATION
    - REMOTE_COMPONENT__KYC_VERIFICATION_HOME
  
  
### Dynamic Targets

- New Page
- New verification tab
- Fiat wallet deposit and withdrawal page

# Meta Object
Dynamic targets are generated based on meta object values. Below you can see essential fields to deine each plugin type. These values should be added to the meta object under the view.json file to define the type of the plugin. These valuse are already set when you are using templates. See Develop section for more information.

#### New page:
```sh
{
    "meta": {
        "is_page": true,
        "path": "/route-name"
    }
}
```

#### New verification tab:

```sh
  "meta": {
    "is_verification_tab": true,
    "type": "home" or "verification",
  }
```

#### Fiat Wallet
```sh
  "meta": {
    "is_wallet": true,
    "type": "deposit" or "withdraw",
    "currency": "USD" /* currency symbol /*
  }
```

# Develop
To start developing a plugin, you first need to decide about the type of the plugin. Below is the list of available plugin types:

| Type |  |
| ------ | ------ |
| page | adds a new page with customizable access from the side and top menus |
| verification-tab | adds a new verification tab to the user verification page |
| fiat-wallet | adds a deposit and withdraw page for a fiat currency |
| kyc | adds KYC tab to the user verification page |
| bank | adds bank verification tab to the user verification page |
| raw | adds a template without initial meta object values |

To initialize a plugin template run:
```sh
npm run add-page --plugin=<PLUGIN_NAME> --type=<PLUGIN_TYPE>
```

To add a view to a plugin template run:
```sh
npm run add-view --plugin=<PLUGIN_NAME> --webveiw=<VIEW_NAME>
```

Once the plugin is initialized, run the following commands:

On the starter kit:

```sh
npm start --plugin=<PLUGIN_NAME>
```

On the main kit:
```sh
npm run dev:plugin --plugin=<PLUGIN_NAME>
```

A page reload is required to reflect bundle changes in the browser.

## Strings and icons

You can use strings and icons from the main kit.

You also can define new strings and icons by adding them to strings.json and icons.json under the assets folder respectively.

These values are added to the kit strings and icons object during kit initialization. To use local assets in your component, you should convert the local id to the global one by using generateId function from the kit context. See kit context.

## Kit context

We can always directly use props passed from the kit to the remote component. However in order to prevent passing some props through many levels, a context is provided to make these props globally accessible.
You can partially subscribe to the context to access props from the kit in a more efficient way.

```sh
import React from "react";
import { withKit } from 'components/KitContext';

const Title = ({ user: { username } = {}, strings: STRINGS }) => (
  <div className="secondary-text">
    {STRINGS.formatString(STRINGS[generateId('hello')], username)}
  </div>
);

const mapContextToProps = ({ user, generateId, strings }) => ({ user, generateId, strings });

export default withKit(mapContextToProps)(Title);
```