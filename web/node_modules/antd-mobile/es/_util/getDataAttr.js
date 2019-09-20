export default (function (props) {
    return Object.keys(props).reduce(function (prev, key) {
        if (key.substr(0, 5) === 'aria-' || key.substr(0, 5) === 'data-' || key === 'role') {
            prev[key] = props[key];
        }
        return prev;
    }, {});
});