"use strict";
var KRUtils = (function () {
    function KRUtils() {
    }
    KRUtils.deepClone = function (obj) {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;
        if (obj instanceof Date)
            var temp = new obj.constructor(); //or new Date(obj);
        else
            var temp = obj.constructor();
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = KRUtils.deepClone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    };
    KRUtils.mergeObj = function (source1, source2) {
        Object.keys(source2).forEach(function (key) {
            if (!!source1[key] && KRUtils.isPrimitive(source1[key])) {
                KRUtils.mergeObj(source1[key], source2[key]);
            }
            else {
                source1[key] = source2[key];
            }
        });
        return source1;
    };
    KRUtils.isPrimitive = function (obj) {
        switch (typeof obj) {
            case 'string':
            case 'number':
            case 'boolean':
                return true;
            default:
                break;
        }
        return !!(obj instanceof String || obj === String ||
            obj instanceof Number || obj === Number ||
            obj instanceof Boolean || obj === Boolean);
    };
    KRUtils.notEmpty = function (val) {
        return val !== undefined && val != null;
    };
    return KRUtils;
}());
exports.KRUtils = KRUtils;
//# sourceMappingURL=utils.type.js.map