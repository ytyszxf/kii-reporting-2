"use strict";
var series_type_1 = require('./series.type');
var series_annotation_1 = require('./series.annotation');
var KRPieSeries = (function (_super) {
    __extends(KRPieSeries, _super);
    function KRPieSeries() {
        _super.apply(this, arguments);
    }
    KRPieSeries.prototype._render = function () {
        var _this = this;
        var data = this.data;
        var mergeData = [];
        data.forEach(function (d) {
            d.data.forEach(function (_d) {
                mergeData.push({ path: d.path, data: _d });
            });
        });
        var seriesOpt = [this.buildOptions({
                data: mergeData.map(function (_d) {
                    return { name: _d.data[0] + '-' + _this.getName(_d.path), value: _d.data[1] };
                })
            })];
        this._echartSeriesOptions = seriesOpt;
        console.log(this._echartSeriesOptions);
    };
    Object.defineProperty(KRPieSeries.prototype, "variables", {
        get: function () {
            return {
                independentVar: this._seriesOptions.field.split('>')[0],
                dependentVar: [this._seriesOptions.field]
            };
        },
        enumerable: true,
        configurable: true
    });
    KRPieSeries.prototype.buildOptions = function (opts) {
        var _opts = {
            type: 'pie',
        };
        if (this._options.radius) {
            this.putProperty(_opts, this._options, 'radius');
        }
        else {
            _opts.radius = [
                [["0%", "80%"]],
                [["0%", "50%"], ["60%", "80%"]],
                [["0", "40%"], ["48%", "62%"], ["70%", "80%"]]
            ][this._chartContainer.series.length - 1][this._chartContainer.series.indexOf(this)];
        }
        Object.assign(_opts, opts);
        return _opts;
    };
    KRPieSeries = __decorate([
        series_annotation_1.ChartSeries({
            seriesTypes: ['pie'],
            hasAxises: false
        }), 
        __metadata('design:paramtypes', [])
    ], KRPieSeries);
    return KRPieSeries;
}(series_type_1.KRSeries));
exports.KRPieSeries = KRPieSeries;
//# sourceMappingURL=pie-series.type.js.map