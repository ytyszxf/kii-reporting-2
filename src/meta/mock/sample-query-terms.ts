export const sampleQueryTerms = {
  "filter": {},
  "aggregation": {
    "byHour": {
      "aggs": {
        "byType": {
          "terms": {
            "field": "type"
          },
          "aggs": {
            "avg_brightness": {
              "avg": {
                "field": "brightness"
              }
            },
            "sum_brightness": {
              "sum": {
                "field": "brightness"
              }
            }
          }
        },
        "avg_brightness": {
          "avg": {
            "field": "brightness"
          }
        },
        "avg_power": {
          "avg": {
            "field": "power"
          }
        }
      },
           
      "date_histogram": {
        "field": "date",
        "interval": "hour"
      }
    }
  }
};