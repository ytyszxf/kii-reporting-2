"use strict";
var series_type_1 = require('./series.type');
var series_annotation_1 = require('./series.annotation');
var KRLineSeries = (function (_super) {
    __extends(KRLineSeries, _super);
    function KRLineSeries() {
        _super.apply(this, arguments);
    }
    KRLineSeries.prototype._render = function () {
        var _this = this;
        var data = this.data;
        this.names = [];
        var seriesOpt = [];
        seriesOpt = data.map(function (d) {
            var name = _this.getName(d.path), data = _this._dataType === 'category' ? d.data.map(function (_d) { return _d[1]; }) : d.data;
            _this.names.indexOf(name) === -1 && _this.names.push(name);
            return _this.buildOptions({
                name: name,
                data: data
            });
        });
        this._echartSeriesOptions = seriesOpt;
        console.log(this._echartSeriesOptions);
    };
    Object.defineProperty(KRLineSeries.prototype, "variables", {
        get: function () {
            return {
                independentVar: this._chartContainer.independentAxis[0].field,
                dependentVar: [this._seriesOptions.field]
            };
        },
        enumerable: true,
        configurable: true
    });
    KRLineSeries.prototype.buildOptions = function (opts) {
        var _opts = {
            type: 'line',
            showSymbol: this._options.showSymbol,
            stack: this._options.stack || this._seriesType === 'area' ? true : false,
        };
        if (this._axisIndex !== undefined) {
            if (this._isVertical) {
                _opts.yAxisIndex = this._axisIndex;
            }
            else {
                _opts.xAxisIndex = this._axisIndex;
            }
        }
        if (this._seriesType === 'area') {
            _opts.areaStyle = {
                normal: {}
            };
        }
        this.putProperty(_opts, this._options, 'showSymbol');
        this.putProperty(_opts, this._options, 'smooth');
        Object.assign(_opts, opts);
        return _opts;
    };
    KRLineSeries = __decorate([
        series_annotation_1.ChartSeries({
            seriesTypes: ['line', 'area'],
            hasAxises: true,
            defaultTrigger: 'axis'
        }), 
        __metadata('design:paramtypes', [])
    ], KRLineSeries);
    return KRLineSeries;
}(series_type_1.KRSeries));
exports.KRLineSeries = KRLineSeries;
//# sourceMappingURL=line-series.type.js.map