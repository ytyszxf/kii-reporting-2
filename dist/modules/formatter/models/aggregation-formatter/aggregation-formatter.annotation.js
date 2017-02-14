"use strict";
(function (FormatMode) {
    FormatMode[FormatMode["INSERT"] = 0] = "INSERT";
    FormatMode[FormatMode["EXPAND"] = 1] = "EXPAND";
})(exports.FormatMode || (exports.FormatMode = {}));
var FormatMode = exports.FormatMode;
;
function AggFormatter(opt) {
    return function (clazz) {
        clazz.aggType = opt.aggType;
        clazz.formatMode = opt.formatMode;
    };
}
exports.AggFormatter = AggFormatter;
//# sourceMappingURL=aggregation-formatter.annotation.js.map