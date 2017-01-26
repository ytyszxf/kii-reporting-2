```typescript
interface IESXAggregationFormatter {
  aggregationName: string;
  field: string;
  metrics: IESXMetricFormatter[];
  children: IESXAggregationFormatter[];
}

interface IESXMetricFormatter {
  metricName: string;
  field: string;
}

interface IESXFormatter {
  aggFormatters: IESXAggregationFormatter[];
}

interface IFormattedData {
    [dimensionName: string]: [string | number, IFormattedData][] | string | number
}

var fommatedData: IFormattedData = {
  'years': [
    [
      '1981', 
      {
        'CO': 100,
        'CO2': 1000,
        'Locations': [
          [
            'Shanghai', 
            {
              'CO': 100,
              'CO2': 523
            }
          ]
        ]
      }
    ], [
      '1982',
      {
        'CO': 200,
        'CO2': 1001
      }
    ], [
      '1982',
      {
        'CO': 200,
        'CO2': 1001
      }
    ]
  ]
}
```

```javascript
// sudo code
var response = $http.get(‘some es response’);
var dataFormatter = schemaFormatter.format(schema);

for(let aggFormatter of dataFormatter){
  var aggregation = response[aggFormatter.field]
  var fullKeys = getFullAggregationKeys(aggregation);
  
}

function formatedData(aggregationData, fullKeys, formatter){
  let result = [];

  for(let key of fullKeys){
    let data = {};
    result.push([key, data]);

    for(let childFormatter of formatter.children){
      let childAggData = getData(childFormatter, aggregationData);
      let childFullkeys = getFullAggregationKeys(childFormatter, childAggData);
      let childResult = formatedData(childAggData, childFullkeys, childFormatter);
      result[childFormatter.field] = childResult;
    }
  }

  
}


```

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 43,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "byTime": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": 1991,
          "doc_count": 43,
          "status": {
            "doc_count": 835,
            "building": {
              "buckets": [{
                "key": "Shanghai",
                "CO": {
                  "value": 42
                },
                "CO2": {
                  "value": 10
                }
              }]
            }
          },
          "CO2": {
            "value": 54
          },
          "CO": {
            "value": 53
          }
        }
      ]
    }
  }
}
```

```json
{
  "query": {
    "byTime": {
      "aggregation": {
        "CO2": {
          "average": {
            "field": "state.CO2"
          }
        },
        "CO": {
          "average": "state.CO"
        },
        "Building": {
          "calc": {
            "aggs": {
              "CO2": {
                "average": {
                  "field": "state.CO2"
                }
              },
              "CO": {
                "average": {
                  "field": "state.CO"
                }
              }
            }
          },
          "terms": {
            "field": "building"
          }
        }
      },
      "date_histogram": {
        "intervale": "1d",
        "field": "timestamp"
      }
    }
  }
}
```

```json
{
  "chartOptions": {
    "axises": {
      "x": {
        "field": "byTime",
        "options": {
          "name": "时间"
        }
      },
      "y": {
        "field": "byTime>Building>CO2",
        "options": {
          "name": "二氧化碳浓度",
          "type": "line"
        }
      }
    }
  },
  "chartQuery": {
    "filter": {
      "must": [
        {
          "range": {
            "timestamp": {
              "lte": "@endTime",
              "gte": "@startTime"
            }
          }
        }
      ]
    },
    "aggregation": {
      "byTime": {
        "aggregation": {
          "CO2": {
            "average": {
              "field": "state.CO2"
            }
          },
          "CO": {
            "average": "state.CO"
          },
          "Building": {
            "calc": {
              "aggs": {
                "CO2": {
                  "average": {
                    "field": "state.CO2"
                  }
                },
                "CO": {
                  "average": {
                    "field": "state.CO"
                  }
                }
              }
            },
            "terms": {
              "field": "building"
            }
          }
        },
        "date_histogram": {
          "intervale": "1d",
          "field": "timestamp"
        }
      }
    }
  }
}
```

```json
{
  "aggregationName": "DATE_HISTOGRAM",
  "field": "byTime",
  "metrics": [{
    "metricName": "NORMAL",
    "field": "CO2"
  },{
    "metricName": "NORMAL",
    "field": "CO"
  }],
  "children": [{
    "aggregationName": "TERMS",
    "field": "Building",
    "metrics": [{
      "field": "CO",
      "metricName": "normal"
    }, {
      "field": "CO2",
      "metricName": "normal"
    }]
  }]
}
```

```typescript
interface IESAggregation{
  Aggs: {
    [dimension: string]: IESAggregation,
    [metricName: string]: {
      [aggregationMethodName: string]: IAggregationContent
  },
  [slicingMethodName: string]: ISlicingMethod
}
```

```typescript
{
  "byTime": {
    "aggs": {}
    "date_histogram": {
      "interval": "1h",
      "field": "timestamp"
    }
  }
}

{
  "key_as_string": "2016-09-06T00:00:00.000Z",
  "key": 1473120000000,
  "doc_count": 14340,
  "AVG": {
    "value": null
  }
}

[
  [1473120000000, {AVG: 100}], 
  [1473130000000, {AVG: 110}]
]

{
  "buildingA": {
    "aggs": {
      "CO_Avg": {
        "avg": {
          "field": "CO"
        }
      }
    }
    "filter": {
      "terms": {
        "location.Building": ["buildingA"]
      }
    }
  }
}

{
  "buldingA": {
    "doc_count": 105818,
    "CO_Avg": {
      "value": 226927
    }
  }
}

[
  ['buildingA', {CO_Avg: 226927}]
]


{
  "CO2_Ranges":{
    "aggs":{
      "CO2":{"max":{"field":"state.CO2"}}
    },
    "range":{
      "field":"state.Bri",
      "ranges":[
        {"key":"<50","to":50},
        {"key":"50 - 100","from":50,"to":100},
        {"key":"100","from":100}
      ]
    }
  }
}

{
  "CO2_Ranges": {
    "buckets": [
      {
        "key": "<50",
        "to": 50,
        "to_as_string": "50.0",
        "doc_count": 0,
        "CO2": {
          "value": null
        }
      },
      {
        "key": "50 - 100",
        "from": 50,
        "from_as_string": "50.0",
        "to": 100,
        "to_as_string": "100.0",
        "doc_count": 0,
        "CO2": {
          "value": null
        }
      },
      {
        "key": "100",
        "from": 100,
        "from_as_string": "100.0",
        "doc_count": 0,
        "CO2": {
          "value": null
        }
      }
    ]
  }
}

[
  ['<50', {'CO2': 123}],
  ['50 - 100', {'CO2': 333}],
  ['> 100', {'CO2': 523}]
]

{
  "buildings": {
    "aggs": {
      "CO_Avg": {
        "avg": {
          "field": "CO"
        }
      }
    }
    "terms": {
      "field": "building"
    }
  }
}

{
  "buildings": {
    "buckets": [
      {
        "key": "building-1",
        "doc_count": 0,
        "CO": {
          "value": 1413
        }
      },
      {
        "key": "building-2",
        "doc_count": 0,
        "CO": {
          "value": 4123
        }
      }
    ]
  }
}

[
  ['building-1', {CO: 1413}],
  ['building-2', {CO: 1436}],
]

{
  "aggs": {
    "byDate": {
      "CO2": {
        "avg": {
          "field": "state.CO2"
        }
      },
      "Building": {
        "aggs": {
          "CO2": {
            "avg": {
              "field": "CO2"
            }
          }
        },
        "terms": {
          "field": "building"
        }
      }
    },
    "date_histogram": {
      "interval": "1d",
      "field": "timestamp"
    }
  }
}

{
  "axises": {
    "x": {
      "field": "byDate",
      ...
    },
    "y": {
      "field": "byDate>Building>CO2",
    }
  }
}
```