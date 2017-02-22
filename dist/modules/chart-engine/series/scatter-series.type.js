"use strict";
var series_type_1 = require('./series.type');
var series_annotation_1 = require('./series.annotation');
var KRScatterSeries = (function (_super) {
    __extends(KRScatterSeries, _super);
    function KRScatterSeries() {
        _super.apply(this, arguments);
        this._sizeValRange = [Infinity, -Infinity];
    }
    KRScatterSeries.prototype._render = function () {
        var _this = this;
        var data = this.data;
        this.names = [];
        this.data.forEach(function (d) {
            d.data.forEach(function (_d) {
                if (_d[2] === null || _d[2] === undefined)
                    return;
                _this._sizeValRange[0] = _this._sizeValRange[0] < _d[2] ? _this._sizeValRange[0] : _d[2];
                _this._sizeValRange[1] = _this._sizeValRange[1] > _d[2] ? _this._sizeValRange[1] : _d[2];
            });
        });
        if (this._sizeValRange[0] === Infinity) {
            this._sizeValRange = [0, 1];
        }
        var seriesOpt = [];
        seriesOpt = data.map(function (d) {
            var name = _this.getName(d.path);
            _this.names.indexOf(name) === -1 && _this.names.push(name);
            return _this.buildOptions({
                name: name,
                data: _this._dataType === 'category' ? d.data.map(function (_d) { return _d[1]; }) : d.data
            });
        });
        this._echartSeriesOptions = seriesOpt;
        console.log(this._echartSeriesOptions);
    };
    Object.defineProperty(KRScatterSeries.prototype, "variables", {
        get: function () {
            var variables = {
                independentVar: this._chartContainer.independentAxis[0].field,
                dependentVar: [this._seriesOptions.field]
            };
            if (this._seriesOptions.symbolSizeField) {
                variables.dependentVar.push(this._options.symbolSizeField);
            }
            return variables;
        },
        enumerable: true,
        configurable: true
    });
    KRScatterSeries.prototype.buildOptions = function (opts) {
        var max = this._sizeValRange[1], min = this._sizeValRange[0], range = max - min;
        var symbolSize;
        if (this._options.symbolSize) {
            symbolSize = this._options.symbolSize;
        }
        else {
            symbolSize = function (x) {
                if (x === undefined || x === null)
                    return 10;
                var y = Math.pow((x - min) / range, 5) + 0.2;
                return y * 60;
            };
        }
        var _opts = {
            type: 'scatter',
            showSymbol: this._options.showSymbol,
            symbolSize: symbolSize instanceof Function ? function (val) {
                return symbolSize(val[2]);
            } : symbolSize
        };
        if (this._axisIndex !== undefined) {
            if (this._isVertical) {
                _opts.yAxisIndex = this._axisIndex;
            }
            else {
                _opts.xAxisIndex = this._axisIndex;
            }
        }
        Object.assign(_opts, opts);
        return _opts;
    };
    KRScatterSeries = __decorate([
        series_annotation_1.ChartSeries({
            seriesTypes: ['scatter', 'bubble'],
            hasAxises: true,
            defaultTrigger: 'item'
        }), 
        __metadata('design:paramtypes', [])
    ], KRScatterSeries);
    return KRScatterSeries;
}(series_type_1.KRSeries));
exports.KRScatterSeries = KRScatterSeries;
//# sourceMappingURL=scatter-series.type.js.map