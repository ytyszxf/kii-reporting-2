"use strict";
var HaltHandlerProvider = (function () {
    function HaltHandlerProvider() {
    }
    HaltHandlerProvider.getHandler = function (handler) {
        switch (handler) {
            case 'AVG':
                return this._averageHandler;
            case 'IGNORE':
                return this._ignoreHandler;
            case 'VOID':
                return this._voidHandler;
            case 'ZERO':
                return this._zeroHandler;
            default:
                return this._voidHandler;
        }
    };
    HaltHandlerProvider.processDataset = function (dataset, method) {
        var _method = method instanceof Function ? method :
            HaltHandlerProvider.getHandler(method);
        for (var i = 0, d = dataset[i]; i < dataset.length; ++i, d = dataset[i]) {
            if (d.findIndex(function (_d) { return _d === undefined || _d === null; }) === -1)
                continue;
            var r = _method(d, i, dataset);
            if (r !== undefined) {
                dataset[i] = r;
            }
            else {
                dataset.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc get the average value of the nearest values before and after current index
     */
    HaltHandlerProvider._averageHandler = function (data, index, context) {
        var result = [data[0]];
        for (var i = 1; i < data.length; i++) {
            var start_1 = index, end = index, startVal = null, endVal = null;
            while (start_1 > 0) {
                start_1--;
                if (context[start_1][i] !== null) {
                    startVal = context[start_1][i];
                    break;
                }
            }
            while (end < context.length - 1) {
                end++;
                if (context[end][i] !== null) {
                    endVal = context[end][i];
                    break;
                }
            }
            if (startVal === null || endVal === null) {
                return undefined;
            }
            result.push((startVal + endVal) / 2);
        }
        return result;
    };
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc remove the value from array
     */
    HaltHandlerProvider._ignoreHandler = function (data, index, context) {
        return undefined;
    };
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc no interrupt
     */
    HaltHandlerProvider._voidHandler = function (data, index, context) {
        return data;
    };
    /**
     * @param  {[any, any]} data
     * @param  {number} index
     * @param  {Array<any>} context
     * @return {[any, any]} new data
     * @desc return zero value
     */
    HaltHandlerProvider._zeroHandler = function (data, index, context) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i] === undefined || data[i] === null) {
                result.push(0);
            }
            else {
                result.push(data[i]);
            }
        }
        return result;
    };
    return HaltHandlerProvider;
}());
exports.HaltHandlerProvider = HaltHandlerProvider;
//# sourceMappingURL=halt-handler.type.js.map