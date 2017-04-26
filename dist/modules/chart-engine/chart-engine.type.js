"use strict";
var utils_type_1 = require('./utils.type');
var chart_container_type_1 = require('./chart-container.type');
var series_type_type_1 = require('./models/series-type.type');
;
var KRChartEngine = (function () {
    function KRChartEngine(seriesTypes) {
        this._seriesTypes = {};
        this._defaultSettings = {};
        this._configSettings = {};
        this._loadSeriesTypes(seriesTypes);
    }
    Object.defineProperty(KRChartEngine.prototype, "config", {
        get: function () {
            return this._configSettings;
        },
        set: function (conf) {
            this._configSettings = conf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRChartEngine.prototype, "_settings", {
        /**
         * @returns KRChartConfig
         */
        get: function () {
            var settings = {};
            utils_type_1.KRUtils.mergeObj(settings, this._defaultSettings);
            utils_type_1.KRUtils.mergeObj(settings, this._configSettings);
            return settings;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param  {HTMLDivElement} target
     * @param  {IKRChartOptions} opts
     * @param  {DataDictionary} data
     * @param  {IESXAggregationFormatter} formatter
     * @returns KRChartContainer
     * @desc render data and return a chart container instance
     */
    KRChartEngine.prototype.render = function (target, opts, data, formatter, parentContainer) {
        if (!this.validateInputJSON(opts))
            throw new Error('input not valid');
        var chartContainer = new chart_container_type_1.KRChartContainer(target, formatter, opts, this._settings, this, parentContainer);
        /**
         * if axis is specified, can not longer read from chart name field
         * example:
         * {
         *   axises: {
         *     x: '..',
         *     y: '..'
         *   },
         *   // ignored
         *   line: {
         *   }
         * }
         */
        if (opts.axises) {
            var x = void 0, y = void 0;
            x = opts.axises.x;
            y = opts.axises.y;
            this.updateChartContainer(chartContainer, x, y, opts.direction);
        }
        else {
            var _loop_1 = function(seriesTypeName) {
                if (!opts[seriesTypeName])
                    return "continue";
                var seriesType = this_1._findSeriesType(seriesTypeName);
                var series = opts[seriesTypeName];
                if (seriesType.hasAxises) {
                    var x = series.x instanceof Array ?
                        utils_type_1.KRUtils.deepClone(series.x) : [utils_type_1.KRUtils.deepClone(series.x)];
                    var y = series.y instanceof Array ?
                        utils_type_1.KRUtils.deepClone(series.y) : [utils_type_1.KRUtils.deepClone(series.y)];
                    if (opts.direction === 'LeftToRight' || opts.direction === 'RightToLeft') {
                        x.forEach(function (_x) {
                            if (_x.series instanceof Array) {
                                _x.series.forEach(function (s) {
                                    s.type = seriesTypeName;
                                });
                            }
                            else {
                                _x.series.type = seriesTypeName;
                            }
                        });
                    }
                    else {
                        y.forEach(function (_y) {
                            if (_y.series instanceof Array) {
                                _y.series.forEach(function (s) {
                                    s.type = seriesTypeName;
                                });
                            }
                            else {
                                _y.series.type = seriesTypeName;
                            }
                        });
                    }
                    this_1.updateChartContainer(chartContainer, x, y, opts.direction);
                }
                else {
                    var _series = series.series instanceof Array ?
                        series.series : [series.series];
                    this_1.updateChartContainerWithoutAxis(chartContainer, _series, seriesTypeName);
                }
            };
            var this_1 = this;
            for (var _i = 0, SeriesTypeNames_1 = series_type_type_1.SeriesTypeNames; _i < SeriesTypeNames_1.length; _i++) {
                var seriesTypeName = SeriesTypeNames_1[_i];
                _loop_1(seriesTypeName);
            }
        }
        chartContainer.update(data);
        return chartContainer;
    };
    KRChartEngine.prototype.updateChartContainer = function (chartContainer, x, y, direction) {
        var _this = this;
        var ys = y instanceof Array ? y : [y];
        var xs = x instanceof Array ? x : [x];
        xs.forEach(function (_x, xAxisIndex) {
            chartContainer.addXAxis(_x);
        });
        ys.forEach(function (_y, yAxisIndex) {
            chartContainer.addYAxis(_y);
        });
        if (direction === 'LeftToRight' || direction === 'RightToLeft') {
            xs.forEach(function (_x, xAxisIndex) {
                var series = _x.series instanceof Array ?
                    _x.series : [_x.series];
                series.forEach(function (s) {
                    var seriesType = _this._findSeriesType(s.type);
                    chartContainer.addSeries(s.type, seriesType, s, xAxisIndex);
                });
            });
        }
        else {
            ys.forEach(function (_y, yAxisIndex) {
                var series = _y.series instanceof Array ?
                    _y.series : [_y.series];
                series.forEach(function (s) {
                    var seriesType = _this._findSeriesType(s.type);
                    chartContainer.addSeries(s.type, seriesType, s, yAxisIndex);
                });
            });
        }
    };
    KRChartEngine.prototype.updateChartContainerWithoutAxis = function (chartContainer, series, seriesTypeName) {
        var seriesType = this._findSeriesType(seriesTypeName);
        series.forEach(function (_s) {
            var s = utils_type_1.KRUtils.deepClone(_s);
            s.type = seriesTypeName;
            chartContainer.addSeries(seriesTypeName, seriesType, s);
        });
    };
    KRChartEngine.prototype.validateInputJSON = function (input) {
        return true;
    };
    /**
     * @param  {SeriesType} type
     * @return {typeof KRSeries} description
     */
    KRChartEngine.prototype._findSeriesType = function (type) {
        return this._seriesTypes[type];
    };
    /**
     * @param  {Array<typeofKRSeries>} seriesTypes
     * @desc load series into chart engine
     */
    KRChartEngine.prototype._loadSeriesTypes = function (seriesTypes) {
        var _this = this;
        seriesTypes.forEach(function (t) {
            t.seriesTypes.forEach(function (type) {
                _this._seriesTypes[type] = t;
            });
        });
    };
    return KRChartEngine;
}());
exports.KRChartEngine = KRChartEngine;
//# sourceMappingURL=chart-engine.type.js.map