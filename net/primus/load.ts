

var Primus;
export async function loadPrimus() {
    if (typeof Primus == 'undefined') {
        var r = await import(
            /* webpackChunkName: 'tim' */
            '../../src/assert/js/primus.js'
        );
        Primus = r.default;
    }
    return Primus;
}