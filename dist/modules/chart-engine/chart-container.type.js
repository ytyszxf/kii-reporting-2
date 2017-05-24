"use strict";
var colors_1 = require('./settings/colors');
var series_type_1 = require('./series/series.type');
var ECharts = require('echarts');
var utils_type_1 = require('./utils.type');
var axis_type_1 = require('./components/axis.type');
var legend_type_1 = require('./components/legend.type');
var tooltip_type_1 = require('./components/tooltip.type');
/**
 * @author george.lin ljz135790@gmail.com
 */
var KRChartContainer = (function () {
    function KRChartContainer(_containerEle, formatter, chartOptions, settings, _chartEngine, _parent) {
        this._containerEle = _containerEle;
        this._chartEngine = _chartEngine;
        this._parent = _parent;
        this._symbolIndex = 0;
        this._colors = settings.colors || colors_1.ITEM_COLORS;
        var _ele = document.createElement('div');
        _ele.style.height = "100%";
        _ele.style.width = "100%";
        _containerEle.appendChild(_ele);
        this._targetElement = _ele;
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
        this._echartInstance = ECharts.init(this._targetElement);
        this._series.forEach(function (s) {
            s.update(_this._dataDict);
        });
        var esOptions = {};
        // get series    
        var series = [];
        this._series.forEach(function (s) {
            var result = s.series;
            s.seriesIndexes = [];
            for (var i = 0; i < result.length; i++) {
                s.seriesIndexes.push(series.length + i);
            }
            series = series.concat(result);
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
                independentAxisOptions.data = independentAxisOptions.data
                    || this._dataDict.getBucketKeys(this.independentAxis[0].field);
                if (this.independentAxis[0].options.formatter) {
                    var formatter_1 = this.independentAxis[0].options.formatter;
                    independentAxisOptions.data = independentAxisOptions.data
                        || independentAxisOptions.data.map(function (d) { return formatter_1(d); });
                }
                else if (formatterDataType === 'time') {
                    independentAxisOptions.data = independentAxisOptions.data
                        || independentAxisOptions.data.map(function (d) { return _this._formateTimeData(d); });
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
        if (utils_type_1.KRUtils.notEmpty(this._chartOptions.visualMap)) {
            esOptions.visualMap = this._chartOptions.visualMap;
        }
        // **************************************************************
        // get grid
        if (utils_type_1.KRUtils.notEmpty(this._chartOptions.grid)) {
            esOptions.grid = this._chartOptions.grid;
        }
        // **************************************************************
        // get toolbox    
        esOptions.toolbox = {
            feature: {}
        };
        if (utils_type_1.KRUtils.notEmpty(this._chartOptions.toolbox)) {
            Object.assign(esOptions.toolbox, this._chartOptions.toolbox);
        }
        if (this._parent) {
            var customFeature = {
                "myBack": {
                    show: true,
                    title: 'Back',
                    icon: 'path://M384.834,180.699c-0.698,0-348.733,0-348.733,0l73.326-82.187c4.755-5.33,4.289-13.505-1.041-18.26    c-5.328-4.754-13.505-4.29-18.26,1.041l-82.582,92.56c-10.059,11.278-10.058,28.282,0.001,39.557l82.582,92.561    c2.556,2.865,6.097,4.323,9.654,4.323c3.064,0,6.139-1.083,8.606-3.282c5.33-4.755,5.795-12.93,1.041-18.26l-73.326-82.188    c0,0,348.034,0,348.733,0c55.858,0,101.3,45.444,101.3,101.3s-45.443,101.3-101.3,101.3h-61.58    c-7.143,0-12.933,5.791-12.933,12.933c0,7.142,5.79,12.933,12.933,12.933h61.58c70.12,0,127.166-57.046,127.166-127.166    C512,237.745,454.954,180.699,384.834,180.699z',
                    onclick: function () {
                        _this.destroy();
                        _this._parent.show();
                    }
                }
            };
            Object.assign(esOptions.toolbox['feature'], customFeature);
        }
        console.log(esOptions);
        this._echartInstance.on('click', function (event) {
            if (!utils_type_1.KRUtils.notEmpty(event.seriesIndex)) {
                return;
            }
            var series = _this._series.find(function (s) { return s.seriesIndexes.indexOf(event.seriesIndex) > -1; });
            if (_this.independentAxis &&
                _this.independentAxis.length &&
                _this._chartOptions.drilldown) {
                var independentVal = null;
                if (series.dataType === 'category') {
                    independentVal = event.name;
                }
                else {
                    independentVal = event.value[0];
                }
                var newDataDict = (_this._dataDict.getSubset(independentVal, _this.independentAxis[0].field));
                var child = _this._chartEngine.render(_this._containerEle, _this._chartOptions.drilldown, newDataDict, newDataDict.aggFormatter, _this);
                _this.hide();
            }
            else {
                series.onClick(event);
            }
        });
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
    KRChartContainer.prototype.show = function () {
        this._echartInstance.getDom().hidden = false;
    };
    KRChartContainer.prototype.hide = function () {
        this._echartInstance.getDom().hidden = true;
    };
    KRChartContainer.prototype.destroy = function () {
        this._echartInstance.clear();
        this._targetElement.remove();
    };
    return KRChartContainer;
}());
exports.KRChartContainer = KRChartContainer;
//# sourceMappingURL=chart-container.type.js.map