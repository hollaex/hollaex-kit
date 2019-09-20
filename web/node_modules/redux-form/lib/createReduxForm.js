"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _merge4 = _interopRequireDefault(require("lodash/merge"));

var _mapValues2 = _interopRequireDefault(require("lodash/mapValues"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _invariant = _interopRequireDefault(require("invariant"));

var _isPromise = _interopRequireDefault(require("is-promise"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _actions = _interopRequireDefault(require("./actions"));

var _asyncValidation = _interopRequireDefault(require("./asyncValidation"));

var _defaultShouldAsyncValidate = _interopRequireDefault(require("./defaultShouldAsyncValidate"));

var _defaultShouldValidate = _interopRequireDefault(require("./defaultShouldValidate"));

var _defaultShouldError = _interopRequireDefault(require("./defaultShouldError"));

var _defaultShouldWarn = _interopRequireDefault(require("./defaultShouldWarn"));

var _silenceEvent = _interopRequireDefault(require("./events/silenceEvent"));

var _silenceEvents = _interopRequireDefault(require("./events/silenceEvents"));

var _generateValidator = _interopRequireDefault(require("./generateValidator"));

var _handleSubmit = _interopRequireDefault(require("./handleSubmit"));

var _isValid = _interopRequireDefault(require("./selectors/isValid"));

var _plain = _interopRequireDefault(require("./structure/plain"));

var _getDisplayName = _interopRequireDefault(require("./util/getDisplayName"));

var _isHotReloading = _interopRequireDefault(require("./util/isHotReloading"));

var _ReduxFormContext = require("./ReduxFormContext");

var isClassComponent = function isClassComponent(Component) {
  return Boolean(Component && Component.prototype && typeof Component.prototype.isReactComponent === 'object');
}; // extract field-specific actions


var arrayInsert = _actions["default"].arrayInsert,
    arrayMove = _actions["default"].arrayMove,
    arrayPop = _actions["default"].arrayPop,
    arrayPush = _actions["default"].arrayPush,
    arrayRemove = _actions["default"].arrayRemove,
    arrayRemoveAll = _actions["default"].arrayRemoveAll,
    arrayShift = _actions["default"].arrayShift,
    arraySplice = _actions["default"].arraySplice,
    arraySwap = _actions["default"].arraySwap,
    arrayUnshift = _actions["default"].arrayUnshift,
    blur = _actions["default"].blur,
    change = _actions["default"].change,
    focus = _actions["default"].focus,
    formActions = (0, _objectWithoutPropertiesLoose2["default"])(_actions["default"], ["arrayInsert", "arrayMove", "arrayPop", "arrayPush", "arrayRemove", "arrayRemoveAll", "arrayShift", "arraySplice", "arraySwap", "arrayUnshift", "blur", "change", "focus"]);
var arrayActions = {
  arrayInsert: arrayInsert,
  arrayMove: arrayMove,
  arrayPop: arrayPop,
  arrayPush: arrayPush,
  arrayRemove: arrayRemove,
  arrayRemoveAll: arrayRemoveAll,
  arrayShift: arrayShift,
  arraySplice: arraySplice,
  arraySwap: arraySwap,
  arrayUnshift: arrayUnshift
};
var propsToNotUpdateFor = [].concat(Object.keys(_actions["default"]), ['array', 'asyncErrors', 'initialValues', 'syncErrors', 'syncWarnings', 'values', 'registeredFields']);

var checkSubmit = function checkSubmit(submit) {
  if (!submit || typeof submit !== 'function') {
    throw new Error('You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop');
  }

  return submit;
};

/**
 * The decorator that is the main API to redux-form
 */
var createReduxForm = function createReduxForm(structure) {
  var deepEqual = structure.deepEqual,
      empty = structure.empty,
      getIn = structure.getIn,
      setIn = structure.setIn,
      keys = structure.keys,
      fromJS = structure.fromJS;
  var isValid = (0, _isValid["default"])(structure);
  return function (initialConfig) {
    var config = (0, _extends2["default"])({
      touchOnBlur: true,
      touchOnChange: false,
      persistentSubmitErrors: false,
      destroyOnUnmount: true,
      shouldAsyncValidate: _defaultShouldAsyncValidate["default"],
      shouldValidate: _defaultShouldValidate["default"],
      shouldError: _defaultShouldError["default"],
      shouldWarn: _defaultShouldWarn["default"],
      enableReinitialize: false,
      keepDirtyOnReinitialize: false,
      updateUnregisteredFields: false,
      getFormState: function getFormState(state) {
        return getIn(state, 'form');
      },
      pure: true,
      forceUnregisterOnUnmount: false,
      submitAsSideEffect: false
    }, initialConfig);
    return function (WrappedComponent) {
      var Form =
      /*#__PURE__*/
      function (_React$Component) {
        (0, _inheritsLoose2["default"])(Form, _React$Component);

        function Form() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
          _this.wrapped = _react["default"].createRef();
          _this.destroyed = false;
          _this.fieldCounts = {};
          _this.fieldValidators = {};
          _this.lastFieldValidatorKeys = [];
          _this.fieldWarners = {};
          _this.lastFieldWarnerKeys = [];
          _this.innerOnSubmit = undefined;
          _this.submitPromise = undefined;

          _this.getValues = function () {
            return _this.props.values;
          };

          _this.isValid = function () {
            return _this.props.valid;
          };

          _this.isPristine = function () {
            return _this.props.pristine;
          };

          _this.register = function (name, type, getValidator, getWarner) {
            var lastCount = _this.fieldCounts[name];
            var nextCount = (lastCount || 0) + 1;
            _this.fieldCounts[name] = nextCount;

            _this.props.registerField(name, type);

            if (getValidator) {
              _this.fieldValidators[name] = getValidator;
            }

            if (getWarner) {
              _this.fieldWarners[name] = getWarner;
            }
          };

          _this.unregister = function (name) {
            var lastCount = _this.fieldCounts[name];
            if (lastCount === 1) delete _this.fieldCounts[name];else if (lastCount != null) _this.fieldCounts[name] = lastCount - 1;

            if (!_this.destroyed) {
              var _this$props = _this.props,
                  _destroyOnUnmount = _this$props.destroyOnUnmount,
                  forceUnregisterOnUnmount = _this$props.forceUnregisterOnUnmount,
                  unregisterField = _this$props.unregisterField;

              if (_destroyOnUnmount || forceUnregisterOnUnmount) {
                unregisterField(name, _destroyOnUnmount);

                if (!_this.fieldCounts[name]) {
                  delete _this.fieldValidators[name];
                  delete _this.fieldWarners[name];
                  _this.lastFieldValidatorKeys = _this.lastFieldValidatorKeys.filter(function (key) {
                    return key !== name;
                  });
                }
              } else {
                unregisterField(name, false);
              }
            }
          };

          _this.getFieldList = function (options) {
            var registeredFields = _this.props.registeredFields;
            var list = [];

            if (!registeredFields) {
              return list;
            }

            var keySeq = keys(registeredFields);

            if (options) {
              if (options.excludeFieldArray) {
                keySeq = keySeq.filter(function (name) {
                  return getIn(registeredFields, "['" + name + "'].type") !== 'FieldArray';
                });
              }

              if (options.excludeUnregistered) {
                keySeq = keySeq.filter(function (name) {
                  return getIn(registeredFields, "['" + name + "'].count") !== 0;
                });
              }
            }

            return fromJS(keySeq.reduce(function (acc, key) {
              acc.push(key);
              return acc;
            }, list));
          };

          _this.getValidators = function () {
            var validators = {};
            Object.keys(_this.fieldValidators).forEach(function (name) {
              var validator = _this.fieldValidators[name]();

              if (validator) {
                validators[name] = validator;
              }
            });
            return validators;
          };

          _this.generateValidator = function () {
            var validators = _this.getValidators();

            return Object.keys(validators).length ? (0, _generateValidator["default"])(validators, structure) : undefined;
          };

          _this.getWarners = function () {
            var warners = {};
            Object.keys(_this.fieldWarners).forEach(function (name) {
              var warner = _this.fieldWarners[name]();

              if (warner) {
                warners[name] = warner;
              }
            });
            return warners;
          };

          _this.generateWarner = function () {
            var warners = _this.getWarners();

            return Object.keys(warners).length ? (0, _generateValidator["default"])(warners, structure) : undefined;
          };

          _this.asyncValidate = function (name, value, trigger) {
            var _this$props2 = _this.props,
                asyncBlurFields = _this$props2.asyncBlurFields,
                asyncChangeFields = _this$props2.asyncChangeFields,
                asyncErrors = _this$props2.asyncErrors,
                asyncValidate = _this$props2.asyncValidate,
                dispatch = _this$props2.dispatch,
                initialized = _this$props2.initialized,
                pristine = _this$props2.pristine,
                shouldAsyncValidate = _this$props2.shouldAsyncValidate,
                startAsyncValidation = _this$props2.startAsyncValidation,
                stopAsyncValidation = _this$props2.stopAsyncValidation,
                syncErrors = _this$props2.syncErrors,
                values = _this$props2.values;
            var submitting = !name;

            var fieldNeedsValidation = function fieldNeedsValidation() {
              var fieldNeedsValidationForBlur = asyncBlurFields && name && ~asyncBlurFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]'));
              var fieldNeedsValidationForChange = asyncChangeFields && name && ~asyncChangeFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]'));
              var asyncValidateByDefault = !(asyncBlurFields || asyncChangeFields);
              return submitting || asyncValidateByDefault || (trigger === 'blur' ? fieldNeedsValidationForBlur : fieldNeedsValidationForChange);
            };

            if (asyncValidate) {
              var valuesToValidate = submitting ? values : setIn(values, name, value);
              var syncValidationPasses = submitting || !getIn(syncErrors, name);

              if (fieldNeedsValidation() && shouldAsyncValidate({
                asyncErrors: asyncErrors,
                initialized: initialized,
                trigger: submitting ? 'submit' : trigger,
                blurredField: name,
                pristine: pristine,
                syncValidationPasses: syncValidationPasses
              })) {
                return (0, _asyncValidation["default"])(function () {
                  return asyncValidate(valuesToValidate, dispatch, _this.props, name);
                }, startAsyncValidation, stopAsyncValidation, name);
              }
            }
          };

          _this.submitCompleted = function (result) {
            delete _this.submitPromise;
            return result;
          };

          _this.submitFailed = function (error) {
            delete _this.submitPromise;
            throw error;
          };

          _this.listenToSubmit = function (promise) {
            if (!(0, _isPromise["default"])(promise)) {
              return promise;
            }

            _this.submitPromise = promise;
            return promise.then(_this.submitCompleted, _this.submitFailed);
          };

          _this.submit = function (submitOrEvent) {
            var _this$props3 = _this.props,
                onSubmit = _this$props3.onSubmit,
                blur = _this$props3.blur,
                change = _this$props3.change,
                dispatch = _this$props3.dispatch;

            if (!submitOrEvent || (0, _silenceEvent["default"])(submitOrEvent)) {
              // submitOrEvent is an event: fire submit if not already submitting
              if (!_this.submitPromise) {
                // avoid recursive stack trace if use Form with onSubmit as handleSubmit
                if (_this.innerOnSubmit && _this.innerOnSubmit !== _this.submit) {
                  // will call "submitOrEvent is the submit function" block below
                  return _this.innerOnSubmit();
                } else {
                  return _this.listenToSubmit((0, _handleSubmit["default"])(checkSubmit(onSubmit), (0, _extends2["default"])({}, _this.props, (0, _redux.bindActionCreators)({
                    blur: blur,
                    change: change
                  }, dispatch)), _this.props.validExceptSubmit, _this.asyncValidate, _this.getFieldList({
                    excludeFieldArray: true,
                    excludeUnregistered: true
                  })));
                }
              }
            } else {
              // submitOrEvent is the submit function: return deferred submit thunk
              return (0, _silenceEvents["default"])(function () {
                return !_this.submitPromise && _this.listenToSubmit((0, _handleSubmit["default"])(checkSubmit(submitOrEvent), (0, _extends2["default"])({}, _this.props, (0, _redux.bindActionCreators)({
                  blur: blur,
                  change: change
                }, dispatch)), _this.props.validExceptSubmit, _this.asyncValidate, _this.getFieldList({
                  excludeFieldArray: true,
                  excludeUnregistered: true
                })));
              });
            }
          };

          _this.reset = function () {
            return _this.props.reset();
          };

          return _this;
        }

        var _proto = Form.prototype;

        _proto.initIfNeeded = function initIfNeeded(nextProps) {
          var enableReinitialize = this.props.enableReinitialize;

          if (nextProps) {
            if ((enableReinitialize || !nextProps.initialized) && !deepEqual(this.props.initialValues, nextProps.initialValues)) {
              var _keepDirty = nextProps.initialized && this.props.keepDirtyOnReinitialize;

              this.props.initialize(nextProps.initialValues, _keepDirty, {
                keepValues: nextProps.keepValues,
                lastInitialValues: this.props.initialValues,
                updateUnregisteredFields: nextProps.updateUnregisteredFields
              });
            }
          } else if (this.props.initialValues && (!this.props.initialized || enableReinitialize)) {
            this.props.initialize(this.props.initialValues, this.props.keepDirtyOnReinitialize, {
              keepValues: this.props.keepValues,
              updateUnregisteredFields: this.props.updateUnregisteredFields
            });
          }
        };

        _proto.updateSyncErrorsIfNeeded = function updateSyncErrorsIfNeeded(nextSyncErrors, nextError, lastSyncErrors) {
          var _this$props4 = this.props,
              error = _this$props4.error,
              updateSyncErrors = _this$props4.updateSyncErrors;
          var noErrors = (!lastSyncErrors || !Object.keys(lastSyncErrors).length) && !error;
          var nextNoErrors = (!nextSyncErrors || !Object.keys(nextSyncErrors).length) && !nextError;

          if (!(noErrors && nextNoErrors) && (!_plain["default"].deepEqual(lastSyncErrors, nextSyncErrors) || !_plain["default"].deepEqual(error, nextError))) {
            updateSyncErrors(nextSyncErrors, nextError);
          }
        };

        _proto.clearSubmitPromiseIfNeeded = function clearSubmitPromiseIfNeeded(nextProps) {
          var submitting = this.props.submitting;

          if (this.submitPromise && submitting && !nextProps.submitting) {
            delete this.submitPromise;
          }
        };

        _proto.submitIfNeeded = function submitIfNeeded(nextProps) {
          var _this$props5 = this.props,
              clearSubmit = _this$props5.clearSubmit,
              triggerSubmit = _this$props5.triggerSubmit;

          if (!triggerSubmit && nextProps.triggerSubmit) {
            clearSubmit();
            this.submit();
          }
        };

        _proto.shouldErrorFunction = function shouldErrorFunction() {
          var _this$props6 = this.props,
              shouldValidate = _this$props6.shouldValidate,
              shouldError = _this$props6.shouldError;
          var shouldValidateOverridden = shouldValidate !== _defaultShouldValidate["default"];
          var shouldErrorOverridden = shouldError !== _defaultShouldError["default"];
          return shouldValidateOverridden && !shouldErrorOverridden ? shouldValidate : shouldError;
        };

        _proto.validateIfNeeded = function validateIfNeeded(nextProps) {
          var _this$props7 = this.props,
              validate = _this$props7.validate,
              values = _this$props7.values;
          var shouldError = this.shouldErrorFunction();
          var fieldLevelValidate = this.generateValidator();

          if (validate || fieldLevelValidate) {
            var initialRender = nextProps === undefined;
            var fieldValidatorKeys = Object.keys(this.getValidators());
            var validateParams = {
              values: values,
              nextProps: nextProps,
              props: this.props,
              initialRender: initialRender,
              lastFieldValidatorKeys: this.lastFieldValidatorKeys,
              fieldValidatorKeys: fieldValidatorKeys,
              structure: structure
            };

            if (shouldError(validateParams)) {
              var propsToValidate = initialRender || !nextProps ? this.props : nextProps;

              var _merge2 = (0, _merge4["default"])(validate ? validate(propsToValidate.values, propsToValidate) || {} : {}, fieldLevelValidate ? fieldLevelValidate(propsToValidate.values, propsToValidate) || {} : {}),
                  _error = _merge2._error,
                  nextSyncErrors = (0, _objectWithoutPropertiesLoose2["default"])(_merge2, ["_error"]);

              this.lastFieldValidatorKeys = fieldValidatorKeys;
              this.updateSyncErrorsIfNeeded(nextSyncErrors, _error, propsToValidate.syncErrors);
            }
          } else {
            this.lastFieldValidatorKeys = [];
          }
        };

        _proto.updateSyncWarningsIfNeeded = function updateSyncWarningsIfNeeded(nextSyncWarnings, nextWarning, lastSyncWarnings) {
          var _this$props8 = this.props,
              warning = _this$props8.warning,
              updateSyncWarnings = _this$props8.updateSyncWarnings;
          var noWarnings = (!lastSyncWarnings || !Object.keys(lastSyncWarnings).length) && !warning;
          var nextNoWarnings = (!nextSyncWarnings || !Object.keys(nextSyncWarnings).length) && !nextWarning;

          if (!(noWarnings && nextNoWarnings) && (!_plain["default"].deepEqual(lastSyncWarnings, nextSyncWarnings) || !_plain["default"].deepEqual(warning, nextWarning))) {
            updateSyncWarnings(nextSyncWarnings, nextWarning);
          }
        };

        _proto.shouldWarnFunction = function shouldWarnFunction() {
          var _this$props9 = this.props,
              shouldValidate = _this$props9.shouldValidate,
              shouldWarn = _this$props9.shouldWarn;
          var shouldValidateOverridden = shouldValidate !== _defaultShouldValidate["default"];
          var shouldWarnOverridden = shouldWarn !== _defaultShouldWarn["default"];
          return shouldValidateOverridden && !shouldWarnOverridden ? shouldValidate : shouldWarn;
        };

        _proto.warnIfNeeded = function warnIfNeeded(nextProps) {
          var _this$props10 = this.props,
              warn = _this$props10.warn,
              values = _this$props10.values;
          var shouldWarn = this.shouldWarnFunction();
          var fieldLevelWarn = this.generateWarner();

          if (warn || fieldLevelWarn) {
            var initialRender = nextProps === undefined;
            var fieldWarnerKeys = Object.keys(this.getWarners());
            var validateParams = {
              values: values,
              nextProps: nextProps,
              props: this.props,
              initialRender: initialRender,
              lastFieldValidatorKeys: this.lastFieldWarnerKeys,
              fieldValidatorKeys: fieldWarnerKeys,
              structure: structure
            };

            if (shouldWarn(validateParams)) {
              var propsToWarn = initialRender || !nextProps ? this.props : nextProps;

              var _merge3 = (0, _merge4["default"])(warn ? warn(propsToWarn.values, propsToWarn) : {}, fieldLevelWarn ? fieldLevelWarn(propsToWarn.values, propsToWarn) : {}),
                  _warning = _merge3._warning,
                  nextSyncWarnings = (0, _objectWithoutPropertiesLoose2["default"])(_merge3, ["_warning"]);

              this.lastFieldWarnerKeys = fieldWarnerKeys;
              this.updateSyncWarningsIfNeeded(nextSyncWarnings, _warning, propsToWarn.syncWarnings);
            }
          }
        };

        _proto.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
          if (!(0, _isHotReloading["default"])()) {
            this.initIfNeeded();
            this.validateIfNeeded();
            this.warnIfNeeded();
          }

          (0, _invariant["default"])(this.props.shouldValidate, 'shouldValidate() is deprecated and will be removed in v9.0.0. Use shouldWarn() or shouldError() instead.');
        };

        _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
          this.initIfNeeded(nextProps);
          this.validateIfNeeded(nextProps);
          this.warnIfNeeded(nextProps);
          this.clearSubmitPromiseIfNeeded(nextProps);
          this.submitIfNeeded(nextProps);
          var onChange = nextProps.onChange,
              values = nextProps.values,
              dispatch = nextProps.dispatch;

          if (onChange && !deepEqual(values, this.props.values)) {
            onChange(values, dispatch, nextProps, this.props.values);
          }
        };

        _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
          var _this2 = this;

          if (!this.props.pure) return true;
          var _config$immutableProp = config.immutableProps,
              immutableProps = _config$immutableProp === void 0 ? [] : _config$immutableProp; // if we have children, we MUST update in React 16
          // https://twitter.com/erikras/status/915866544558788608

          return !!(this.props.children || nextProps.children || Object.keys(nextProps).some(function (prop) {
            // useful to debug rerenders
            // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
            //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
            // }
            if (~immutableProps.indexOf(prop)) {
              return _this2.props[prop] !== nextProps[prop];
            }

            return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(_this2.props[prop], nextProps[prop]);
          }));
        };

        _proto.componentDidMount = function componentDidMount() {
          if (!(0, _isHotReloading["default"])()) {
            this.initIfNeeded(this.props);
            this.validateIfNeeded();
            this.warnIfNeeded();
          }

          (0, _invariant["default"])(this.props.shouldValidate, 'shouldValidate() is deprecated and will be removed in v9.0.0. Use shouldWarn() or shouldError() instead.');
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          var _this$props11 = this.props,
              destroyOnUnmount = _this$props11.destroyOnUnmount,
              destroy = _this$props11.destroy;

          if (destroyOnUnmount && !(0, _isHotReloading["default"])()) {
            this.destroyed = true;
            destroy();
          }
        };

        _proto.render = function render() {
          var _ref,
              _this3 = this;

          // remove some redux-form config-only props

          /* eslint-disable no-unused-vars */
          var _this$props12 = this.props,
              anyTouched = _this$props12.anyTouched,
              array = _this$props12.array,
              arrayInsert = _this$props12.arrayInsert,
              arrayMove = _this$props12.arrayMove,
              arrayPop = _this$props12.arrayPop,
              arrayPush = _this$props12.arrayPush,
              arrayRemove = _this$props12.arrayRemove,
              arrayRemoveAll = _this$props12.arrayRemoveAll,
              arrayShift = _this$props12.arrayShift,
              arraySplice = _this$props12.arraySplice,
              arraySwap = _this$props12.arraySwap,
              arrayUnshift = _this$props12.arrayUnshift,
              asyncErrors = _this$props12.asyncErrors,
              asyncValidate = _this$props12.asyncValidate,
              asyncValidating = _this$props12.asyncValidating,
              blur = _this$props12.blur,
              change = _this$props12.change,
              clearSubmit = _this$props12.clearSubmit,
              destroy = _this$props12.destroy,
              destroyOnUnmount = _this$props12.destroyOnUnmount,
              forceUnregisterOnUnmount = _this$props12.forceUnregisterOnUnmount,
              dirty = _this$props12.dirty,
              dispatch = _this$props12.dispatch,
              enableReinitialize = _this$props12.enableReinitialize,
              error = _this$props12.error,
              focus = _this$props12.focus,
              form = _this$props12.form,
              getFormState = _this$props12.getFormState,
              immutableProps = _this$props12.immutableProps,
              initialize = _this$props12.initialize,
              initialized = _this$props12.initialized,
              initialValues = _this$props12.initialValues,
              invalid = _this$props12.invalid,
              keepDirtyOnReinitialize = _this$props12.keepDirtyOnReinitialize,
              keepValues = _this$props12.keepValues,
              updateUnregisteredFields = _this$props12.updateUnregisteredFields,
              pristine = _this$props12.pristine,
              propNamespace = _this$props12.propNamespace,
              registeredFields = _this$props12.registeredFields,
              registerField = _this$props12.registerField,
              reset = _this$props12.reset,
              resetSection = _this$props12.resetSection,
              setSubmitFailed = _this$props12.setSubmitFailed,
              setSubmitSucceeded = _this$props12.setSubmitSucceeded,
              shouldAsyncValidate = _this$props12.shouldAsyncValidate,
              shouldValidate = _this$props12.shouldValidate,
              shouldError = _this$props12.shouldError,
              shouldWarn = _this$props12.shouldWarn,
              startAsyncValidation = _this$props12.startAsyncValidation,
              startSubmit = _this$props12.startSubmit,
              stopAsyncValidation = _this$props12.stopAsyncValidation,
              stopSubmit = _this$props12.stopSubmit,
              submitAsSideEffect = _this$props12.submitAsSideEffect,
              submitting = _this$props12.submitting,
              submitFailed = _this$props12.submitFailed,
              submitSucceeded = _this$props12.submitSucceeded,
              touch = _this$props12.touch,
              touchOnBlur = _this$props12.touchOnBlur,
              touchOnChange = _this$props12.touchOnChange,
              persistentSubmitErrors = _this$props12.persistentSubmitErrors,
              syncErrors = _this$props12.syncErrors,
              syncWarnings = _this$props12.syncWarnings,
              unregisterField = _this$props12.unregisterField,
              untouch = _this$props12.untouch,
              updateSyncErrors = _this$props12.updateSyncErrors,
              updateSyncWarnings = _this$props12.updateSyncWarnings,
              valid = _this$props12.valid,
              validExceptSubmit = _this$props12.validExceptSubmit,
              values = _this$props12.values,
              warning = _this$props12.warning,
              rest = (0, _objectWithoutPropertiesLoose2["default"])(_this$props12, ["anyTouched", "array", "arrayInsert", "arrayMove", "arrayPop", "arrayPush", "arrayRemove", "arrayRemoveAll", "arrayShift", "arraySplice", "arraySwap", "arrayUnshift", "asyncErrors", "asyncValidate", "asyncValidating", "blur", "change", "clearSubmit", "destroy", "destroyOnUnmount", "forceUnregisterOnUnmount", "dirty", "dispatch", "enableReinitialize", "error", "focus", "form", "getFormState", "immutableProps", "initialize", "initialized", "initialValues", "invalid", "keepDirtyOnReinitialize", "keepValues", "updateUnregisteredFields", "pristine", "propNamespace", "registeredFields", "registerField", "reset", "resetSection", "setSubmitFailed", "setSubmitSucceeded", "shouldAsyncValidate", "shouldValidate", "shouldError", "shouldWarn", "startAsyncValidation", "startSubmit", "stopAsyncValidation", "stopSubmit", "submitAsSideEffect", "submitting", "submitFailed", "submitSucceeded", "touch", "touchOnBlur", "touchOnChange", "persistentSubmitErrors", "syncErrors", "syncWarnings", "unregisterField", "untouch", "updateSyncErrors", "updateSyncWarnings", "valid", "validExceptSubmit", "values", "warning"]);
          /* eslint-enable no-unused-vars */

          var reduxFormProps = (0, _extends2["default"])({
            array: array,
            anyTouched: anyTouched,
            asyncValidate: this.asyncValidate,
            asyncValidating: asyncValidating
          }, (0, _redux.bindActionCreators)({
            blur: blur,
            change: change
          }, dispatch), {
            clearSubmit: clearSubmit,
            destroy: destroy,
            dirty: dirty,
            dispatch: dispatch,
            error: error,
            form: form,
            handleSubmit: this.submit,
            initialize: initialize,
            initialized: initialized,
            initialValues: initialValues,
            invalid: invalid,
            pristine: pristine,
            reset: reset,
            resetSection: resetSection,
            submitting: submitting,
            submitAsSideEffect: submitAsSideEffect,
            submitFailed: submitFailed,
            submitSucceeded: submitSucceeded,
            touch: touch,
            untouch: untouch,
            valid: valid,
            warning: warning
          });
          var propsToPass = (0, _extends2["default"])({}, propNamespace ? (_ref = {}, _ref[propNamespace] = reduxFormProps, _ref) : reduxFormProps, rest);

          if (isClassComponent(WrappedComponent)) {
            ;
            propsToPass.ref = this.wrapped;
          }

          var _reduxForm = (0, _extends2["default"])({}, this.props, {
            getFormState: function getFormState(state) {
              return getIn(_this3.props.getFormState(state), _this3.props.form);
            },
            asyncValidate: this.asyncValidate,
            getValues: this.getValues,
            sectionPrefix: undefined,
            register: this.register,
            unregister: this.unregister,
            registerInnerOnSubmit: function registerInnerOnSubmit(innerOnSubmit) {
              return _this3.innerOnSubmit = innerOnSubmit;
            }
          });

          return (0, _react.createElement)(_ReduxFormContext.ReduxFormContext.Provider, {
            value: _reduxForm,
            children: (0, _react.createElement)(WrappedComponent, propsToPass)
          });
        };

        return Form;
      }(_react["default"].Component);

      Form.displayName = "Form(" + (0, _getDisplayName["default"])(WrappedComponent) + ")";
      Form.WrappedComponent = WrappedComponent;
      Form.propTypes = {
        destroyOnUnmount: _propTypes["default"].bool,
        forceUnregisterOnUnmount: _propTypes["default"].bool,
        form: _propTypes["default"].string.isRequired,
        immutableProps: _propTypes["default"].arrayOf(_propTypes["default"].string),
        initialValues: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object]),
        getFormState: _propTypes["default"].func,
        onSubmitFail: _propTypes["default"].func,
        onSubmitSuccess: _propTypes["default"].func,
        propNamespace: _propTypes["default"].string,
        validate: _propTypes["default"].func,
        warn: _propTypes["default"].func,
        touchOnBlur: _propTypes["default"].bool,
        touchOnChange: _propTypes["default"].bool,
        triggerSubmit: _propTypes["default"].bool,
        persistentSubmitErrors: _propTypes["default"].bool,
        registeredFields: _propTypes["default"].any
      };
      var connector = (0, _reactRedux.connect)(function (state, props) {
        var form = props.form,
            getFormState = props.getFormState,
            initialValues = props.initialValues,
            enableReinitialize = props.enableReinitialize,
            keepDirtyOnReinitialize = props.keepDirtyOnReinitialize;
        var formState = getIn(getFormState(state) || empty, form) || empty;
        var stateInitial = getIn(formState, 'initial');
        var initialized = !!stateInitial;
        var shouldUpdateInitialValues = enableReinitialize && initialized && !deepEqual(initialValues, stateInitial);
        var shouldResetValues = shouldUpdateInitialValues && !keepDirtyOnReinitialize;
        var initial = initialValues || stateInitial || empty;

        if (!shouldUpdateInitialValues) {
          initial = stateInitial || empty;
        }

        var values = getIn(formState, 'values') || initial;

        if (shouldResetValues) {
          values = initial;
        }

        var pristine = shouldResetValues || deepEqual(initial, values);
        var asyncErrors = getIn(formState, 'asyncErrors');

        var syncErrors = getIn(formState, 'syncErrors') || _plain["default"].empty;

        var syncWarnings = getIn(formState, 'syncWarnings') || _plain["default"].empty;

        var registeredFields = getIn(formState, 'registeredFields');
        var valid = isValid(form, getFormState, false)(state);
        var validExceptSubmit = isValid(form, getFormState, true)(state);
        var anyTouched = !!getIn(formState, 'anyTouched');
        var submitting = !!getIn(formState, 'submitting');
        var submitFailed = !!getIn(formState, 'submitFailed');
        var submitSucceeded = !!getIn(formState, 'submitSucceeded');
        var error = getIn(formState, 'error');
        var warning = getIn(formState, 'warning');
        var triggerSubmit = getIn(formState, 'triggerSubmit');
        return {
          anyTouched: anyTouched,
          asyncErrors: asyncErrors,
          asyncValidating: getIn(formState, 'asyncValidating') || false,
          dirty: !pristine,
          error: error,
          initialized: initialized,
          invalid: !valid,
          pristine: pristine,
          registeredFields: registeredFields,
          submitting: submitting,
          submitFailed: submitFailed,
          submitSucceeded: submitSucceeded,
          syncErrors: syncErrors,
          syncWarnings: syncWarnings,
          triggerSubmit: triggerSubmit,
          values: values,
          valid: valid,
          validExceptSubmit: validExceptSubmit,
          warning: warning
        };
      }, function (dispatch, initialProps) {
        var bindForm = function bindForm(actionCreator) {
          return actionCreator.bind(null, initialProps.form);
        }; // Bind the first parameter on `props.form`


        var boundFormACs = (0, _mapValues2["default"])(formActions, bindForm);
        var boundArrayACs = (0, _mapValues2["default"])(arrayActions, bindForm);

        var boundBlur = function boundBlur(field, value) {
          return blur(initialProps.form, field, value, !!initialProps.touchOnBlur);
        };

        var boundChange = function boundChange(field, value) {
          return change(initialProps.form, field, value, !!initialProps.touchOnChange, !!initialProps.persistentSubmitErrors);
        };

        var boundFocus = bindForm(focus); // Wrap action creators with `dispatch`

        var connectedFormACs = (0, _redux.bindActionCreators)(boundFormACs, dispatch);
        var connectedArrayACs = {
          insert: (0, _redux.bindActionCreators)(boundArrayACs.arrayInsert, dispatch),
          move: (0, _redux.bindActionCreators)(boundArrayACs.arrayMove, dispatch),
          pop: (0, _redux.bindActionCreators)(boundArrayACs.arrayPop, dispatch),
          push: (0, _redux.bindActionCreators)(boundArrayACs.arrayPush, dispatch),
          remove: (0, _redux.bindActionCreators)(boundArrayACs.arrayRemove, dispatch),
          removeAll: (0, _redux.bindActionCreators)(boundArrayACs.arrayRemoveAll, dispatch),
          shift: (0, _redux.bindActionCreators)(boundArrayACs.arrayShift, dispatch),
          splice: (0, _redux.bindActionCreators)(boundArrayACs.arraySplice, dispatch),
          swap: (0, _redux.bindActionCreators)(boundArrayACs.arraySwap, dispatch),
          unshift: (0, _redux.bindActionCreators)(boundArrayACs.arrayUnshift, dispatch)
        };
        return (0, _extends2["default"])({}, connectedFormACs, boundArrayACs, {
          blur: boundBlur,
          change: boundChange,
          array: connectedArrayACs,
          focus: boundFocus,
          dispatch: dispatch
        });
      }, undefined, {
        forwardRef: true
      });
      var ConnectedForm = (0, _hoistNonReactStatics["default"])(connector(Form), WrappedComponent);
      ConnectedForm.defaultProps = config; // build outer component to expose instance api

      var ReduxForm =
      /*#__PURE__*/
      function (_React$Component2) {
        (0, _inheritsLoose2["default"])(ReduxForm, _React$Component2);

        function ReduxForm() {
          var _this4;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this4 = _React$Component2.call.apply(_React$Component2, [this].concat(args)) || this;
          _this4.ref = _react["default"].createRef();
          return _this4;
        }

        var _proto2 = ReduxForm.prototype;

        _proto2.submit = function submit() {
          return this.ref.current && this.ref.current.submit();
        };

        _proto2.reset = function reset() {
          if (this.ref) {
            this.ref.current.reset();
          }
        };

        _proto2.render = function render() {
          var _this$props13 = this.props,
              initialValues = _this$props13.initialValues,
              rest = (0, _objectWithoutPropertiesLoose2["default"])(_this$props13, ["initialValues"]);
          return (0, _react.createElement)(ConnectedForm, (0, _extends2["default"])({}, rest, {
            ref: this.ref,
            // convert initialValues if need to
            initialValues: fromJS(initialValues)
          }));
        };

        (0, _createClass2["default"])(ReduxForm, [{
          key: "valid",
          get: function get() {
            return !!(this.ref.current && this.ref.current.isValid());
          }
        }, {
          key: "invalid",
          get: function get() {
            return !this.valid;
          }
        }, {
          key: "pristine",
          get: function get() {
            return !!(this.ref.current && this.ref.current.isPristine());
          }
        }, {
          key: "dirty",
          get: function get() {
            return !this.pristine;
          }
        }, {
          key: "values",
          get: function get() {
            return this.ref.current ? this.ref.current.getValues() : empty;
          }
        }, {
          key: "fieldList",
          get: function get() {
            // mainly provided for testing
            return this.ref.current ? this.ref.current.getFieldList() : [];
          }
        }, {
          key: "wrappedInstance",
          get: function get() {
            // for testing
            return this.ref.current && this.ref.current.wrapped.current;
          }
        }]);
        return ReduxForm;
      }(_react["default"].Component);

      (0, _reactLifecyclesCompat.polyfill)(ReduxForm);
      var WithContext = (0, _hoistNonReactStatics["default"])((0, _ReduxFormContext.withReduxForm)(ReduxForm), WrappedComponent);
      WithContext.defaultProps = config;
      return WithContext;
    };
  };
};

var _default = createReduxForm;
exports["default"] = _default;