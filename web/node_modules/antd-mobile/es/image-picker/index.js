import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* tslint:disable:no-bitwise */
import classnames from 'classnames';
import React from 'react';
import TouchFeedback from 'rmc-feedback';
import Flex from '../flex';
function noop() {}

var ImagePicker = function (_React$Component) {
    _inherits(ImagePicker, _React$Component);

    function ImagePicker() {
        _classCallCheck(this, ImagePicker);

        // http://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
        var _this = _possibleConstructorReturn(this, (ImagePicker.__proto__ || Object.getPrototypeOf(ImagePicker)).apply(this, arguments));

        _this.getOrientation = function (file, callback) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var view = new DataView(e.target.result);
                if (view.getUint16(0, false) !== 0xffd8) {
                    return callback(-2);
                }
                var length = view.byteLength;
                var offset = 2;
                while (offset < length) {
                    var marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker === 0xffe1) {
                        var tmp = view.getUint32(offset += 2, false);
                        if (tmp !== 0x45786966) {
                            return callback(-1);
                        }
                        var little = view.getUint16(offset += 6, false) === 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        var tags = view.getUint16(offset, little);
                        offset += 2;
                        for (var i = 0; i < tags; i++) {
                            if (view.getUint16(offset + i * 12, little) === 0x0112) {
                                return callback(view.getUint16(offset + i * 12 + 8, little));
                            }
                        }
                    } else if ((marker & 0xff00) !== 0xff00) {
                        break;
                    } else {
                        offset += view.getUint16(offset, false);
                    }
                }
                return callback(-1);
            };
            reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
        };
        _this.getRotation = function () {
            var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            var imgRotation = 0;
            switch (orientation) {
                case 3:
                    imgRotation = 180;
                    break;
                case 6:
                    imgRotation = 90;
                    break;
                case 8:
                    imgRotation = 270;
                    break;
                default:
            }
            return imgRotation;
        };
        _this.removeImage = function (index) {
            var newImages = [];
            var _this$props$files = _this.props.files,
                files = _this$props$files === undefined ? [] : _this$props$files;

            files.forEach(function (image, idx) {
                if (index !== idx) {
                    newImages.push(image);
                }
            });
            if (_this.props.onChange) {
                _this.props.onChange(newImages, 'remove', index);
            }
        };
        _this.addImage = function (imgItem) {
            var _this$props$files2 = _this.props.files,
                files = _this$props$files2 === undefined ? [] : _this$props$files2;

            var newImages = files.concat(imgItem);
            if (_this.props.onChange) {
                _this.props.onChange(newImages, 'add');
            }
        };
        _this.onImageClick = function (index) {
            if (_this.props.onImageClick) {
                _this.props.onImageClick(index, _this.props.files);
            }
        };
        _this.onFileChange = function () {
            var fileSelectorEl = _this.fileSelectorInput;
            if (fileSelectorEl && fileSelectorEl.files && fileSelectorEl.files.length) {
                var files = fileSelectorEl.files;
                for (var i = 0; i < files.length; i++) {
                    _this.parseFile(files[i], i);
                }
            }
            if (fileSelectorEl) {
                fileSelectorEl.value = '';
            }
        };
        _this.parseFile = function (file, index) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataURL = e.target.result;
                if (!dataURL) {
                    if (_this.props.onFail) {
                        _this.props.onFail('Fail to get the ' + index + ' image');
                    }
                    return;
                }
                var orientation = 1;
                _this.getOrientation(file, function (res) {
                    // -2: not jpeg , -1: not defined
                    if (res > 0) {
                        orientation = res;
                    }
                    _this.addImage({
                        url: dataURL,
                        orientation: orientation,
                        file: file
                    });
                });
            };
            reader.readAsDataURL(file);
        };
        return _this;
    }

    _createClass(ImagePicker, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                prefixCls = _props.prefixCls,
                style = _props.style,
                className = _props.className,
                _props$files = _props.files,
                files = _props$files === undefined ? [] : _props$files,
                selectable = _props.selectable,
                onAddImageClick = _props.onAddImageClick,
                multiple = _props.multiple,
                accept = _props.accept;

            var imgItemList = [];
            var count = parseInt('' + this.props.length, 10);
            if (count <= 0) {
                count = 4;
            }
            var wrapCls = classnames('' + prefixCls, className);
            files.forEach(function (image, index) {
                var imgStyle = {
                    backgroundImage: 'url(' + image.url + ')',
                    transform: 'rotate(' + _this2.getRotation(image.orientation) + 'deg)'
                };
                var itemStyle = {};
                imgItemList.push(React.createElement(
                    Flex.Item,
                    { key: 'item-' + index, style: itemStyle },
                    React.createElement(
                        'div',
                        { key: index, className: prefixCls + '-item' },
                        React.createElement('div', { className: prefixCls + '-item-remove', role: 'button', 'aria-label': 'Click and Remove this image'
                            // tslint:disable-next-line:jsx-no-multiline-js
                            , onClick: function onClick() {
                                _this2.removeImage(index);
                            } }),
                        React.createElement('div', { className: prefixCls + '-item-content', role: 'button', 'aria-label': 'Image can be clicked'
                            // tslint:disable-next-line:jsx-no-multiline-js
                            , onClick: function onClick() {
                                _this2.onImageClick(index);
                            }, style: imgStyle })
                    )
                ));
            });
            var selectEl = React.createElement(
                Flex.Item,
                { key: 'select' },
                React.createElement(
                    TouchFeedback,
                    { activeClassName: prefixCls + '-upload-btn-active' },
                    React.createElement(
                        'div',
                        { className: prefixCls + '-item ' + prefixCls + '-upload-btn', onClick: onAddImageClick, role: 'button', 'aria-label': 'Choose and add image' },
                        React.createElement('input', { ref: function ref(input) {
                                if (input) {
                                    _this2.fileSelectorInput = input;
                                }
                            }, type: 'file', accept: accept
                            // tslint:disable-next-line:jsx-no-multiline-js
                            , onChange: function onChange() {
                                _this2.onFileChange();
                            }, multiple: multiple })
                    )
                )
            );
            var allEl = selectable ? imgItemList.concat([selectEl]) : imgItemList;
            var length = allEl.length;
            if (length !== 0 && length % count !== 0) {
                var blankCount = count - length % count;
                var fillBlankEl = [];
                for (var i = 0; i < blankCount; i++) {
                    fillBlankEl.push(React.createElement(Flex.Item, { key: 'blank-' + i }));
                }
                allEl = allEl.concat(fillBlankEl);
            }
            var flexEl = [];
            for (var _i = 0; _i < allEl.length / count; _i++) {
                var rowEl = allEl.slice(_i * count, _i * count + count);
                flexEl.push(rowEl);
            }
            var renderEl = flexEl.map(function (item, index) {
                return React.createElement(
                    Flex,
                    { key: 'flex-' + index },
                    item
                );
            });
            return React.createElement(
                'div',
                { className: wrapCls, style: style },
                React.createElement(
                    'div',
                    { className: prefixCls + '-list', role: 'group' },
                    renderEl
                )
            );
        }
    }]);

    return ImagePicker;
}(React.Component);

export default ImagePicker;

ImagePicker.defaultProps = {
    prefixCls: 'am-image-picker',
    files: [],
    onChange: noop,
    onImageClick: noop,
    onAddImageClick: noop,
    onFail: noop,
    selectable: true,
    multiple: false,
    accept: 'image/*',
    length: 4
};