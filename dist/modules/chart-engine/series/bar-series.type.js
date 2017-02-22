"use strict";
var series_type_1 = require('./series.type');
var series_annotation_1 = require('./series.annotation');
var KRBarSeries = (function (_super) {
    __extends(KRBarSeries, _super);
    function KRBarSeries() {
        _super.apply(this, arguments);
    }
    KRBarSeries.prototype._render = function () {
        var _this = this;
        var data = this.data;
        var seriesOpt = [];
        this.names = [];
        seriesOpt = data.map(function (d, i) {
            var data;
            if (_this._dataType === 'category') {
                data = d.data.map(function (_d, j) {
                    return {
                        value: _d[1],
                    };
                });
            }
            else {
                data = d.data.map(function (_d, j) {
                    return {
                        value: _d
                    };
                });
            }
            if (_this._seriesOptions.split) {
                data.map(function (_d, j) {
                    _d['itemStyle'] = {
                        normal: {
                            color: _this._chartContainer.color[j % _this._chartContainer.color.length]
                        }
                    };
                });
            }
            var name = _this.getName(d.path);
            _this.names.indexOf(name) === -1 && _this.names.push(name);
            return _this.buildOptions({
                name: name,
                data: data
            });
        });
        this._echartSeriesOptions = seriesOpt;
        console.log(this._echartSeriesOptions);
    };
    Object.defineProperty(KRBarSeries.prototype, "variables", {
        get: function () {
            return {
                independentVar: this._chartContainer.independentAxis[0].field,
                dependentVar: [this._seriesOptions.field]
            };
        },
        enumerable: true,
        configurable: true
    });
    KRBarSeries.prototype.buildOptions = function (opts) {
        var _opts = {
            type: 'bar',
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
        this.putProperty(_opts, this._options, 'showSymbol');
        this.putProperty(_opts, this._options, 'smooth');
        this.putProperty(_opts, this._options, 'stack');
        this.putProperty(_opts, this._options, 'label');
        this.putProperty(_opts, this._options, 'itemStyle');
        Object.assign(_opts, opts);
        return _opts;
    };
    KRBarSeries = __decorate([
        series_annotation_1.ChartSeries({
            seriesTypes: ['bar'],
            hasAxises: true,
            defaultTrigger: 'item'
        }), 
        __metadata('design:paramtypes', [])
    ], KRBarSeries);
    return KRBarSeries;
}(series_type_1.KRSeries));
exports.KRBarSeries = KRBarSeries;
//# sourceMappingURL=bar-series.type.js.map