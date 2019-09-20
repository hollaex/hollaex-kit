import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _mapValues from "lodash/mapValues";
import _isEqual from "lodash/isEqual";
import _isEmpty from "lodash/isEmpty";
import React from 'react';
import { connect } from 'react-redux';
import prefixName from './util/prefixName';
import { withReduxForm } from './ReduxFormContext';

var createValues = function createValues(_ref) {
  var getIn = _ref.getIn;
  return function (firstArg) {
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    // create a class that reads current form name and creates a selector
    // return
    return function (Component) {
      var FormValues =
      /*#__PURE__*/
      function (_React$Component) {
        _inheritsLoose(FormValues, _React$Component);

        function FormValues(props) {
          var _this;

          _this = _React$Component.call(this, props) || this;

          if (!props._reduxForm) {
            throw new Error('formValues() must be used inside a React tree decorated with reduxForm()');
          }

          _this.updateComponent(props);

          return _this;
        }

        var _proto = FormValues.prototype;

        _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(props) {
          if (typeof firstArg === 'function') {
            this.updateComponent(props);
          }
        };

        _proto.render = function render() {
          var Component = this.Component;
          return React.createElement(Component // so that the connected component updates props when sectionPrefix has changed
          , _extends({
            sectionPrefix: this.props._reduxForm.sectionPrefix
          }, this.props));
        };

        _proto.updateComponent = function updateComponent(props) {
          var valuesMap;
          var resolvedFirstArg = typeof firstArg === 'function' ? firstArg(props) : firstArg;

          if (typeof resolvedFirstArg === 'string') {
            var _rest$reduce;

            valuesMap = rest.reduce(function (result, k) {
              result[k] = k;
              return result;
            }, (_rest$reduce = {}, _rest$reduce[resolvedFirstArg] = resolvedFirstArg, _rest$reduce));
          } else {
            valuesMap = resolvedFirstArg;
          }

          if (_isEmpty(valuesMap)) {
            // maybe that empty valuesMap is ok if firstArg is a function?
            // if this is the case, we probably should set this.Component = Component
            throw new Error('formValues(): You must specify values to get as formValues(name1, name2, ...) or formValues({propName1: propPath1, ...}) or formValues((props) => name) or formValues((props) => ({propName1: propPath1, ...}))');
          }

          if (_isEqual(valuesMap, this._valuesMap)) {
            // no change in valuesMap
            return;
          }

          this._valuesMap = valuesMap;
          this.setComponent();
        };

        _proto.setComponent = function setComponent() {
          var _this2 = this;

          var formValuesSelector = function formValuesSelector(_, _ref2) {
            var sectionPrefix = _ref2.sectionPrefix;
            // Yes, we're only using connect() for listening to updates.
            // The second argument needs to be there so that connect calls
            // the selector when props change
            var getValues = _this2.props._reduxForm.getValues;
            var values = getValues();
            return _mapValues(_this2._valuesMap, function (path) {
              return getIn(values, prefixName(_this2.props, path));
            });
          };

          this.Component = connect(formValuesSelector, function () {
            return {};
          } // ignore dispatch
          )(function (_ref3) {
            var sectionPrefix = _ref3.sectionPrefix,
                otherProps = _objectWithoutPropertiesLoose(_ref3, ["sectionPrefix"]);

            return React.createElement(Component, otherProps);
          });
        };

        return FormValues;
      }(React.Component);

      return withReduxForm(FormValues);
    };
  };
};

export default createValues;