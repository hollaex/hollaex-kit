import _typeof from 'babel-runtime/helpers/typeof';
function formatIt(date, form) {
    var pad = function pad(n) {
        return n < 10 ? '0' + n : n;
    };
    var dateStr = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
    var timeStr = pad(date.getHours()) + ':' + pad(date.getMinutes());
    if (form === 'YYYY-MM-DD') {
        return dateStr;
    }
    if (form === 'HH:mm') {
        return timeStr;
    }
    return dateStr + ' ' + timeStr;
}
export function formatFn(instance, value) {
    var formatsEnum = {
        date: 'YYYY-MM-DD',
        time: 'HH:mm',
        datetime: 'YYYY-MM-DD HH:mm'
    };
    var format = instance.props.format;

    var type = typeof format === 'undefined' ? 'undefined' : _typeof(format);
    if (type === 'string') {
        return formatIt(value, format);
    }
    if (type === 'function') {
        return format(value);
    }
    return formatIt(value, formatsEnum[instance.props.mode]);
}