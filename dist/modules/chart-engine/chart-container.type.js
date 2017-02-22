"use strict";
var colors_1 = require('./settings/colors');
var series_type_1 = require('./series/series.type');
var ECharts = require('echarts');
var axis_type_1 = require('./components/axis.type');
var legend_type_1 = require('./components/legend.type');
var tooltip_type_1 = require('./components/tooltip.type');
/**
 * @author george.lin ljz135790@gmail.com
 */
var KRChartContainer = (function () {
    function KRChartContainer(ele, formatter, chartOptions, settings) {
        this._symbolIndex = 0;
        this._colors = colors_1.ITEM_COLORS;
        this._containerElement = ele;
        this._xAxises = [];
        this._yAxises = [];
        this._series = [];
        if (chartOptions.legend) {
            this._legend = new legend_type_1.KRLegend(this, chartOptions.legend);
        }
        if (chartOptions.tooltip) {
            this._tooltip = new tooltip_type_1.KRToolTip(this, chartOptions.tooltip);
        }
        this._formatter = formatter;
        this._chartSettings = settings;
        this._chartDirection = chartOptions.direction || 'BottomToTop';
        this._chartOptions = chartOptions;
    }
    Object.defineProperty(KRChartContainer.prototype, "isVertical", {
        get: function () {
            return this._chartDirection === 'TopToBottom' || this._chartDirection === 'BottomToTop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRChartContainer.prototype, "series", {
        get: function () {
            return this._series;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRChartContainer.prototype, "independentAxis", {
        get: function () {
            return this.isVertical ?
                this._xAxises : this._yAxises;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRChartContainer.prototype, "dependentAxis", {
        get: function () {
            return this.isVertical ?
                this._yAxises : this._xAxises;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KRChartContainer.prototype, "color", {
        get: function () {
            return this._colors;
        },
        enumerable: true,
        configurable: true
    });
    KRChartContainer.prototype.update = function (dataDict) {
        this._dataDict = dataDict;
        this.render();
    };
    KRChartContainer.prototype.addSeries = function (typeName, seriesType, seriesOpt, yAxisGroupIndex) {
        var _this = this;
        /**
         * @desc this class only helps to
         * add constrains for ts compiler
         */
        var VirtualSeries = (function (_super) {
            __extends(VirtualSeries, _super);
            function VirtualSeries() {
                _super.apply(this, arguments);
            }
            VirtualSeries.prototype._render = function () { };
            ;
            Object.defineProperty(VirtualSeries.prototype, "variables", {
                get: function () { return null; },
                enumerable: true,
                configurable: true
            });
            return VirtualSeries;
        }(series_type_1.KRSeries));
        var dataType = null;
        if (this.independentAxis[0]) {
            dataType = this.independentAxis[0].options.type ||
                this._formatter.children.find(function (f) { return f.field === _this.independentAxis[0].field; }).type;
        }
        var series = new seriesType(this, typeName, dataType, seriesOpt, yAxisGroupIndex);
        this._series.push(series);
    };
    KRChartContainer.prototype.render = function () {
        var _this = this;
        this._echartInstance = ECharts.init(this._containerElement);
        this._series.forEach(function (s) {
            s.update(_this._dataDict);
        });
        var esOptions = {};
        // get series    
        var series = [];
        this._series.forEach(function (s) {
            series = series.concat(s.series);
        });
        esOptions.series = series;
        esOptions.color = this._colors;
        // **************************************************************
        // get axis
        if (this.independentAxis.length) {
            var independentAxisOptions = this.independentAxis[0];
            var formatterDataType = this._formatter
                .children.find(function (f) { return f.field === _this.independentAxis[0].field; }).type;
            var dataType = this.independentAxis[0].options.type;
            if (dataType === 'category') {
                independentAxisOptions.data = this._dataDict.getBucketKeys(this.independentAxis[0].field);
                if (this.independentAxis[0].options.formatter) {
                    var formatter_1 = this.independentAxis[0].options.formatter;
                    independentAxisOptions.data = independentAxisOptions.data.map(function (d) { return formatter_1(d); });
                }
                else if (formatterDataType === 'time') {
                    independentAxisOptions.data = independentAxisOptions.data.map(function (d) { return _this._formateTimeData(d); });
                }
            }
            var dependentAxisOtions = this.dependentAxis.map(function (axis) {
                return axis.options;
            });
            if (this._chartDirection === 'LeftToRight' || this._chartDirection === 'RightToLeft') {
                esOptions.xAxis = dependentAxisOtions;
                esOptions.yAxis = independentAxisOptions.options;
            }
            else {
                esOptions.xAxis = independentAxisOptions.options;
                esOptions.yAxis = dependentAxisOtions;
            }
        }
        // **************************************************************
        // get tooltip
        if (this._tooltip) {
            esOptions.tooltip = this._tooltip.options;
        }
        // **************************************************************
        // get legend
        if (this._legend && this._legend.options.show) {
            this._legend.setData(this._dataDict);
            esOptions.legend = this._legend.options;
        }
        // **************************************************************
        // get data zoom
        // **************************************************************
        // get visual map
        esOptions.visualMap = this._chartOptions.visualMap;
        // **************************************************************
        // get grid
        esOptions.grid = this._chartOptions.grid;
        // **************************************************************
        console.log(esOptions);
        this._echartInstance.setOption(esOptions);
    };
    /**
     * @desc get symbol from symbol enum
     * color will repeat if number of series exceed the total size of symbol pool.
     */
    KRChartContainer.prototype.getSymbol = function () {
        var symbol = this._symbols[this._symbolIndex++];
        this._symbolIndex = this._symbolIndex >= this._symbols.length ?
            0 : this._symbolIndex;
        return symbol;
    };
    /**
     * @desc add X axis
     * @param  {IKRXAxis} xOpts
     */
    KRChartContainer.prototype.addXAxis = function (xOpts) {
        this._addXAxis([xOpts]);
    };
    /**
     * @desc add Y aixs
     * @param  {IKRYAxis} yOpts
     */
    KRChartContainer.prototype.addYAxis = function (yOpts) {
        this._addYAxis([yOpts]);
    };
    KRChartContainer.prototype.getSeries = function () {
        return this._series;
    };
    /**
     * @param  {IKRXAxis} xOpts
     */
    KRChartContainer.prototype._addXAxis = function (opts) {
        var _this = this;
        opts.forEach(function (opt, i) {
            var xAxis = new axis_type_1.KRAxis(opt);
            _this._xAxises.push(xAxis);
            if (_this.isVertical) {
                var dataType = opt.options.type || _this._formatter
                    .children.find(function (f) { return f.field === opt.field; })
                    .type;
                xAxis.setOptions({ type: dataType });
            }
        });
    };
    /**
     * @param  {IKRYAxis} yOpts
     */
    KRChartContainer.prototype._addYAxis = function (opts) {
        var _this = this;
        opts.forEach(function (opt, i) {
            var yAxis = new axis_type_1.KRAxis(opt);
            _this._yAxises.push(yAxis);
            if (!_this.isVertical) {
                var dataType = opt.options.type || _this._formatter
                    .children.find(function (f) { return f.field === opt.field; })
                    .type;
                yAxis.setOptions({ type: dataType });
            }
        });
    };
    KRChartContainer.prototype._formateTimeData = function (date) {
        var d = new Date(date);
        return [
            d.getFullYear(),
            ('0' + (d.getMonth() + 1)).slice(-2),
            ('0' + d.getDate()).slice(-2)
        ].join('/')
            + ' ' +
            [
                ('0' + d.getHours()).slice(-2),
                ('0' + d.getMinutes()).slice(-2)
            ].join(':');
    };
    return KRChartContainer;
}());
exports.KRChartContainer = KRChartContainer;
//# sourceMappingURL=chart-container.type.js.map