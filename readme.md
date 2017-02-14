## Kii-Reporting Framework
![image](https://cloud.githubusercontent.com/assets/8529214/22919168/32949b30-f2c9-11e6-9a44-e629f1dfb8b9.png)
![image](https://cloud.githubusercontent.com/assets/8529214/22919171/360152e0-f2c9-11e6-8ba8-6322f448392f.png)
![image](https://cloud.githubusercontent.com/assets/8529214/22919146/0a76b5b6-f2c9-11e6-9d19-0684b7bc4d92.png)

### Description
Kii Reporting Framework is designed to be a Elastic Search compatable and query-view schema based reporting charts renderer. The main advantages are:
- Powerful interactive UI.
- No more data formatter for complex Elastic Search Response. Data formating is done by framework.
- Easy to ember in H5 project. The project is pure javascript implementation.
- Intuitive JSON data structure.

```javascript
var opts = {
  "chartOptions": {
    "grid": {
      "right": 80
    },
    "visualMap": {
        type: 'continuous',
        dimension: 1,
        text: ['High', 'Low'],
        itemHeight: 200,
        calculable: true,
        min: 100,
        max: 600,
        top: 60,
        right: 10,
        inRange: {
            colorLightness: [0.8, 0.2]
        },
        outOfRange: {
            color: '#000'
        },
        controller: {
            inRange: {
                color: '#ffa976'
            }
        }
    },
    "axises": {
      "x": {
        "field": "Location",
        "options": {
          "interval": 6 * 60 * 60 * 1000,
          "name": "",
          "axisLabel": {
            textStyle: {
              color: "#000"
            }
          },
          "axisLine": {
            "lineStyle": {
              "width": 0
            }
          },
          "axisTick": {
            show: false
          }
        }
      },
      "y": [
        {
          "series": {
            "type": "bar",
            "field": "Location>MD",
            "haltHandler": "ZERO",
            "label": {
              "normal": {
                "formatter": "{c}kwh",
                "position": "insideRight"
              }
            },
            "itemStyle": {
              "normal": {
                "opacity": 0.8
              }
            }
          },
          "options": {
            "splitLine": {
              "lineStyle": {
                "type": "dashed"
              }
            },
            "axisLine": {
              "lineStyle": {
                "width": 1,
                color: "#999"
              }
            },
            "axisTick": {
              show: false
            }
          }
        }
      ]
    }
  },
  "chartQuery": {
    "filter": {
      "must": [{
        "range": {
          "timeStamp": {
            "gte": 1485705600000,
            "lte": 1485792000000 + 60 * 60 * 1 * 1000,
            "format": "epoch_millis"
          }
        }
      }]
    },
    "aggregation": {
      "Location": {
        "terms": {
          "field": "fields._stringField2"
        },
        "aggs": {
          "MD": {
            "sum": {
              "field": "state.activeTotalChange"
            }
          }
        }
      }
    }
  }
};

// es response 
let response = '...';
```

```javascript
// init framework
let {
  formatterEngine, chartEngine
} = bootstrap();

// get data formatter
let parser = new KRQueryParser();
let formatter = parser.parseQuery(opts.chartQuery);

// formatter data
let dataDict = formatterEngine.format(response, formatter);

// rendering chart on target element
let target = document.getElementById('target');
chartEngine.render(target, opts.chartOptions, dataDict, formatter);
```

### Development Guide
#### Prerequisite
- nodejs > 4.0
- typescript > 2.0

### CLI
- run on development mode by `npm start`, and visit http://localhost:3001
- build production by `npm run build:prod`


  