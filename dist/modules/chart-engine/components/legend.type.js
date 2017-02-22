"use strict";
var utils_type_1 = require('../utils.type');
var KRLegend = (function () {
    function KRLegend(_container, _options) {
        if (_options === void 0) { _options = {}; }
        this._container = _container;
        this._options = _options;
        this._init();
    }
    KRLegend.prototype._init = function () {
        this._options.show = utils_type_1.KRUtils.notEmpty(this._options.show) ?
            this._options.show : false;
    };
    KRLegend.prototype.setData = function (data) {
        this._data = data;
    };
    Object.defineProperty(KRLegend.prototype, "options", {
        get: function () {
            var _this = this;
            var options = Object.assign({}, this._options);
            if (options.bind)
                delete options.bind;
            if (!this._options.data && this._options.bind) {
                var bind = this._options.bind instanceof String ?
                    [this._options.bind] : this._options.bind;
                var names_1 = [];
                bind.forEach(function (id) {
                    _this._container.series
                        .filter(function (s) { return s.id === id; })
                        .forEach(function (s) {
                        s.names.forEach(function (name) {
                            names_1.indexOf(name) === -1 && names_1.push(name);
                        });
                    });
                });
                options.data = names_1;
            }
            else if (!this._options.data && !this._options.bind
                && this._container.series) {
                var names_2 = [];
                this._container.series.forEach(function (s) {
                    s.names.forEach(function (n) {
                        names_2.indexOf(n) === -1 && names_2.push(n);
                    });
                });
                options.data = names_2;
            }
            return options;
        },
        enumerable: true,
        configurable: true
    });
    return KRLegend;
}());
exports.KRLegend = KRLegend;
//# sourceMappingURL=legend.type.js.map