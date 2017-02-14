"use strict";
var halt_handler_type_1 = require('../models/halt-handler.type');
var data_dictionary_type_1 = require('../../formatter/models/data-dictionary.type');
var KRSeries = (function () {
    /**
     * @param  {IKRChartBindingOptions} bindingOptions
     * @param  {any} dataset
     */
    function KRSeries(chartContainer, seriesType, dataType, seriesOptions, axisIndex, dataset) {
        this._dataDict = dataset;
        this._seriesType = seriesType;
        this._chartContainer = chartContainer;
        this._axisIndex = axisIndex;
        this._dataType = dataType;
        this._seriesOptions = seriesOptions;
    }
    KRSeries.prototype.getName = function (path) {
        if (path === void 0) { path = []; }
        if (typeof this._options.name === 'string') {
            return this._options.name;
        }
        else if (this._options.name instanceof Function) {
            return this._options.name.apply(this, [path]);
        }
        return path.join('-');
    };
    Object.defineProperty(KRSeries.prototype, "series", {
        /**
         * @desc return production of render
         * @returns IECSeriesOptions
         */
        get: function () {
            return this._echartSeriesOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRSeries.prototype, "_options", {
        /**
         *
         */
        get: function () {
            return this._seriesOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRSeries.prototype, "_isVertical", {
        get: function () {
            return this._chartContainer.isVertical;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @desc render series to make it ready
     */
    KRSeries.prototype.render = function () {
        this._render();
        return this.series;
    };
    /**
     *
     */
    KRSeries.prototype.update = function (dataDict) {
        this._dataDict = dataDict;
        return this.render();
    };
    Object.defineProperty(KRSeries.prototype, "variables", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRSeries.prototype, "data", {
        get: function () {
            var variables = this.variables;
            if (!variables.dependentVar.length)
                throw new Error('No metrics given.');
            if (this._options.field) {
                return this.getData(variables);
            }
            else if (this._options.script) {
                return this.renderScript();
            }
            else {
                throw new Error('no data source provided!');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @desc format data
     * @param  {string} bucket
     * @param  {string|string[]} metrics
     */
    KRSeries.prototype.getData = function (variables) {
        var metrics = variables.dependentVar, bucket = variables.independentVar;
        var haltHandler = this._options.haltHandler;
        var searchResult = null;
        for (var _i = 0, metrics_1 = metrics; _i < metrics_1.length; _i++) {
            var metric = metrics_1[_i];
            if (!searchResult) {
                searchResult = this._dataDict.search(bucket, metric);
            }
            else {
                searchResult.merge(this._dataDict.search(bucket, metric));
            }
        }
        var result = searchResult.data;
        var output = data_dictionary_type_1.DataDictionary.isFinal(result) ? [result] : getFinalArrays([], result);
        output.forEach(function (ar) {
            halt_handler_type_1.HaltHandlerProvider.processDataset(ar.data, haltHandler);
        });
        return output;
        function getFinalArrays(path, obj) {
            var keys = Object.keys(obj);
            if (data_dictionary_type_1.DataDictionary.isFinal(obj[keys[0]])) {
                return keys.map(function (key) {
                    return { path: path.concat([key]), data: obj[key].data };
                });
            }
            else {
                var result_1 = [];
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    result_1 = result_1.concat(getFinalArrays(path.concat([key]), obj[key]));
                }
            }
        }
    };
    /**
     * @param  {string} bucket
     * @param  {string|string[]} metrics
     * @return {string[]} categories
     */
    KRSeries.prototype.getCategories = function (bucket, metrics) {
        var _metrics = metrics instanceof Array ?
            metrics : [metrics];
        var result = _metrics[0].split('>').slice(1);
        result.pop();
        return result;
    };
    /**
     * @return {string} get Symbol
     */
    KRSeries.prototype.getSymbol = function () {
        return this._chartContainer.getSymbol();
    };
    /**
     * @desc render script
     */
    KRSeries.prototype.renderScript = function () {
        var _this = this;
        if (!this._options.context || !this._options.context.length)
            throw new Error('context is required by script method.');
        var contexts = this._options.context.map(function (field) {
            return _this.getData(_this._variables);
        });
        var context = contexts[0];
        return context.map(function (d, i) {
            var _cxts = contexts.map(function (c) { return c[i].data; });
            var result = _this._options.script.apply(_this._options.script, [d.path].concat(_cxts));
            return { path: d.path, data: result };
        });
    };
    /**
     * @param  {Object} target
     * @param  {Object} source
     * @param  {string} key
     */
    KRSeries.prototype.putProperty = function (target, source, key) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    };
    return KRSeries;
}());
exports.KRSeries = KRSeries;
//# sourceMappingURL=series.type.js.map