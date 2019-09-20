/* eslint no-eq-null: 0 */
/* eslint eqeqeq: 0 */
/* tslint:disable:triple-equals */
export default function isWindow(obj) {
    return obj != null && obj == obj.window;
}