"use strict";
var KRAxis = (function () {
    function KRAxis(opts) {
        this._options = opts;
    }
    Object.defineProperty(KRAxis.prototype, "field", {
        get: function () {
            return this._options.field;
        },
        enumerable: true,
        configurable: true
    });
    KRAxis.prototype.setOptions = function (opts) {
        Object.assign(this._options.options, opts);
    };
    Object.defineProperty(KRAxis.prototype, "options", {
        get: function () {
            var options = {};
            Object.assign(options, this._options.options);
            return options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRAxis.prototype, "data", {
        get: function () {
            return this._options.options.data;
        },
        set: function (data) {
            this._options.options.data = data;
        },
        enumerable: true,
        configurable: true
    });
    return KRAxis;
}());
exports.KRAxis = KRAxis;
//# sourceMappingURL=axis.type.js.map