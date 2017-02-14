## Kii-Reporting Framework
![image](https://cloud.githubusercontent.com/assets/8529214/22919593/aa2f4580-f2cb-11e6-8aba-e929c7f0e9db.png)



### Description
Kii Reporting Framework is designed to be a Elastic Search compatable and query-view schema based reporting charts renderer. The main advantages are:
- Powerful interactive UI.
- No more data formatter for complex Elastic Search Response. Data formating is done by framework.
- Easy to ember in H5 project. The project is pure javascript implementation.
- Intuitive JSON data structure.

```javascript
// a simple pie chart schema
var opts = {
  "chartOptions": {
    "pie": {
    	"series": [{
        "field": "Position>CALC"
      }]
    }
  },
  "chartQuery": {
    "filter": {
    	"must_not": [],
      "must": [
        {
          "terms": {
            "state.target": [
              "th.f83120e36100-870b-6e11-b1d8-026da82a",
              "th.f83120e36100-870b-6e11-b1d8-034dff1a"
            ]
          }
        },
        {
          "range": {
            "state.date": {
              "gte": 1454406685000,
              "lte": 1486115485121,
              "format": "epoch_millis"
            }
          }
        }
      ]
    },
    "aggregation": {
      "Position": {
        "aggs": {
          "CALC": {
            "sum": {
              "field": "state.CO2"
            }
          }
        },
        "terms": {
          "field": "state.target"
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


  