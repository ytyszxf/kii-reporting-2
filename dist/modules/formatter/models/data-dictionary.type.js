"use strict";
var aggregation_formatter_annotation_1 = require('./aggregation-formatter/aggregation-formatter.annotation');
var DataDictionary = (function () {
    function DataDictionary(data, aggFormatter, formatterEngine) {
        this.data = data;
        this.aggFormatter = aggFormatter;
        this.formatterEngine = formatterEngine;
        this.raw = data;
    }
    DataDictionary.isFinal = function (d) {
        return d.data && d.data instanceof Array;
    };
    DataDictionary.prototype.getBucketKeys = function (root, path) {
        if (path === void 0) { path = []; }
        if (!this.validateRootAndPath(root, path)) {
            throw new Error('root path not match path params!');
        }
        var dataRoot = this.getDataRoot(root, path);
        return dataRoot.map(function (d) { return d[0]; });
    };
    DataDictionary.prototype.search = function (root, query, path) {
        if (path === void 0) { path = []; }
        return this._search(root, query, path);
    };
    DataDictionary.prototype._search = function (root, query, path) {
        if (path === void 0) { path = []; }
        if (!this.validateRootAndPath(root, path)) {
            throw new Error('root path not match path params!');
        }
        if (!this.validateQuery(root, query)) {
            throw new Error('root path not math query path!');
        }
        var dataRoot = this.getDataRoot(root, path);
        var rootPath = root.split('>');
        var pathLink = query.split('>');
        var startIndex = rootPath.length;
        var metric = pathLink.pop();
        var result;
        var self = this;
        if (pathLink.length > rootPath.length) {
            result = {};
            dataRoot.forEach(function (raw) {
                literate(raw[1][pathLink[startIndex]], result, pathLink, startIndex + 1);
                function literate(data, r, pathLink, i) {
                    var formatter = self.getFormatter(pathLink.concat([]).splice(0, i));
                    if (pathLink.length === i) {
                        data.forEach(function (d) {
                            if (formatter.formatMode === aggregation_formatter_annotation_1.FormatMode.EXPAND) {
                                r[d[0]] = r[d[0]] || { data: [] };
                                r[d[0]].data.push([raw[0], d[1][metric]]);
                            }
                            else {
                                r.data = r.data || [];
                                r.data.push([raw[0], d[1][metric]]);
                            }
                        });
                    }
                    else {
                        data.forEach(function (d) {
                            var _d = d[1][pathLink[0]];
                            if (formatter.formatMode === aggregation_formatter_annotation_1.FormatMode.EXPAND) {
                                if (!r[d[0]]) {
                                    r[d[0]] = {};
                                }
                                var _r = r[d[0]];
                                literate(_d, _r, pathLink, i + 1);
                            }
                            else {
                                literate(_d, r, pathLink, i + 1);
                            }
                        });
                    }
                }
            });
        }
        else {
            result = { data: dataRoot.map(function (d) { return [d[0], d[1][metric]]; }) };
        }
        return new SearchResult(result);
    };
    DataDictionary.prototype.getFormatter = function (rootPath) {
        var currentAgg = this.aggFormatter;
        rootPath.forEach(function (pace) {
            currentAgg = currentAgg.children.find(function (f) { return f.field === pace; });
        });
        return this.formatterEngine
            .findAggregationFormatter(currentAgg.aggregationName).constructor;
    };
    DataDictionary.prototype.getDataRoot = function (root, path) {
        var rootPath = root.split('>');
        var _dataRoot = this.data;
        for (var i = 0; i < rootPath.length - 1; i++) {
            _dataRoot = _dataRoot[rootPath[i]][path[i]];
        }
        return _dataRoot[rootPath[rootPath.length - 1]];
    };
    DataDictionary.prototype.validateRootAndPath = function (root, path) {
        var rootPath = root.split('>');
        if (path.length != rootPath.length - 1) {
            return false;
        }
        return true;
    };
    DataDictionary.prototype.validateQuery = function (root, query) {
        var rootPath = root.split('>');
        var queryPath = query.split('>');
        for (var i = 0; i < rootPath.length; i++) {
            if (rootPath[i] !== queryPath[i])
                return false;
        }
        return true;
    };
    DataDictionary.prototype.setData = function (data) {
        this.data = data;
    };
    return DataDictionary;
}());
exports.DataDictionary = DataDictionary;
var SearchResult = (function () {
    function SearchResult(data) {
        this.data = data;
    }
    SearchResult.prototype.merge = function (result) {
        if (DataDictionary.isFinal(this.data)) {
            this.data.data.forEach(function (d, i) {
                result.data.data[i]
                    .slice(1)
                    .forEach(function (d1) {
                    d.push(d1);
                });
            });
        }
        else {
            literate(this.data, result.data);
        }
        function literate(o1, o2) {
            if (DataDictionary.isFinal(o1)) {
                o2['data'].forEach(function (datum, i) {
                    datum.slice(1).forEach(function (d) {
                        o1['data'][i].push(d);
                    });
                });
            }
            else {
                for (var key in o1) {
                    literate(o1[key], o2[key]);
                }
            }
        }
    };
    return SearchResult;
}());
exports.SearchResult = SearchResult;
//# sourceMappingURL=data-dictionary.type.js.map