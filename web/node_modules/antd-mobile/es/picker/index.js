import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import AbstractPicker, { getDefaultProps } from './AbstractPicker';
import PropTypes from 'prop-types';
import popupProps from './popupProps';
// TODO:
// fix error TS4026:Public static property 'defaultProps' of exported class has or is using name 'React.ReactElement'
// fix error TS6133: 'React' is declared but its value is never read.
export var nonsense = React.createElement('div', null);

var Picker = function (_AbstractPicker) {
    _inherits(Picker, _AbstractPicker);

    function Picker() {
        _classCallCheck(this, Picker);

        var _this = _possibleConstructorReturn(this, (Picker.__proto__ || Object.getPrototypeOf(Picker)).apply(this, arguments));

        _this.popupProps = popupProps;
        return _this;
    }

    return Picker;
}(AbstractPicker);

export default Picker;

Picker.defaultProps = getDefaultProps();
Picker.contextTypes = {
    antLocale: PropTypes.object
};