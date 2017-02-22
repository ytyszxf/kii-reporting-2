"use strict";
var triggerTypeSequence = ['item', 'axis'];
var KRToolTip = (function () {
    function KRToolTip(_container, _opts) {
        this._container = _container;
        this._opts = _opts;
        this._init();
    }
    KRToolTip.prototype._init = function () {
    };
    Object.defineProperty(KRToolTip.prototype, "options", {
        /**
         * @desc
         * by default, when independentAxis data type is category,
         * trigger should be axis, otherwise trigger should be item.
         * if trigger type is given, then it won't be overrided.
         */
        get: function () {
            var independentAxis = this._container.independentAxis;
            var options = Object.assign({}, this._opts);
            if (!options.trigger) {
                var triggerTypeIndex_1 = 0;
                this._container.series.forEach(function (s) {
                    var defaultTriggerTypeIndex = triggerTypeSequence
                        .indexOf(s.constructor.defaultTrigger);
                    triggerTypeIndex_1 = triggerTypeIndex_1 > defaultTriggerTypeIndex ?
                        triggerTypeIndex_1 : defaultTriggerTypeIndex;
                });
                options.trigger = triggerTypeSequence[triggerTypeIndex_1];
            }
            return options;
        },
        enumerable: true,
        configurable: true
    });
    return KRToolTip;
}());
exports.KRToolTip = KRToolTip;
//# sourceMappingURL=tooltip.type.js.map