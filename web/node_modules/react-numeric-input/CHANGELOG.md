2.2.3
--------------------------------------------------------------------------------
* Small fix for a bug introduced in 2.2.2.
* Updated the online demo to include examples of the latest props.

2.2.2
--------------------------------------------------------------------------------
* style={false} produces eslint warning so it is deprecated now. There is new `noStyle` boolean prop for that.
* Fixes the case where string value reappears in input when mouse hovers over the up/down button after clicking away.
* Document the `strict` prop.
* A readOnly input is almost like disabled one now. The only difference is that you can copy the value.
* Various small code improvements.

2.2.1
--------------------------------------------------------------------------------
* The input will now use "fontSize: inherit" style.
* Added the componentClass prop (thanks to @Yukioru)
* Fixed small issues in tests
* Added live demo preview (thanks to @ipiranhaa)
* Accept React 16 as peer dependency

2.2.0
--------------------------------------------------------------------------------
* If the component gets re-rendered with new value the onChange callback will not be called.
* If the component is rendered with invalid string value prop the input will render empty instead of having value of `0`.
* Fixed an issue where preventDefault in "onTouchStart" causes double step to happen.
* Added the `strict` prop. In strict mode the value is converted to number (and formated) while the user types. In loose mode (the default mode) you can type anything and the value gets reformatted on blur.
* Added e2e tests.
* The precision prop can also be a function that can decide what precision to use at runtime.
* The min, max and step props can also be functions.

2.1.0
--------------------------------------------------------------------------------
* Added `snap` prop to make the value snap to the closest step when using buttons or up/down keys to change it.
* Pass a reference to the input element to the onChange callbacks
* Fixed an issue preventing the input from being editable when it's entire value is selected
* Fixed an issue that might cause the component to loose its value if re-rendered without value prop

2.0.9
--------------------------------------------------------------------------------
* Field now accepts `"-."`, `"+.`", `"."`, `"-"`, and `"+"` at beginning of input value.
* Merge some pull requests
* Fixed backspace on float values
* Use external prop-types package
* Use react and react-dom v15.6.1

2.0.8
--------------------------------------------------------------------------------
* Fixed `React.PropTypes` reference warnings

2.0.7
--------------------------------------------------------------------------------
* Fixed the focus/blur issues. Thanks to https://github.com/vlad-ignatov/react-numeric-input/pull/25
* onChange gets called when input content is deleted #27

2.0.6
--------------------------------------------------------------------------------
* Use peerDependencies to specify the react versions


2.0.5
--------------------------------------------------------------------------------
* Compatible with React 15.2 and 15.3
* Preserve the selection between re-rendering
* Fix a bug in handling the step prop
* Loose formatting while the user is typing and strict on blur
* Various other fixes

2.0.4
--------------------------------------------------------------------------------
* Make it compatible with React 15
* Inline styles can be disabled by passing style={false}
* Various small fixes and improvements


2.0.3
--------------------------------------------------------------------------------
* Provide more useful data to event callbacks like onChange, onInvalid etc.
* Make sure that onBlur, onFocus and onKeyDown are called the same way React would
call them.


2.0.2
--------------------------------------------------------------------------------
* Add support for callback props onChange, onInvalid, onValid and more...
* defaultValue can also be used instead of value
* Make use of HTML5 input validation if available


2.0.1
--------------------------------------------------------------------------------
* Move react and react-dom to devDependencies so that npm does not install them


2.0.0
--------------------------------------------------------------------------------
* Switch to inline styles
* Better integration with external scripts
* Better integration with build tools
* Support for touch devices


1.0.0
--------------------------------------------------------------------------------
* Initial release
