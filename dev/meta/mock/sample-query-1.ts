export const sampleQuery1 = {
  filter: {},
  aggregation: {
    "byHour": {
      "aggs": {
        "bulb": {
          "filter": {
            "terms": {
              "thingID": ["5be567f6-7252-4c0b-9f19-f82bf07105f1", "25de2faf-107e-456f-9af3-950c33c92af3", "683d6331-1d83-4ab5-a8bb-4968a04908bc"]
            }
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
        "led": {
          "filter": {
            "terms": {
              "thingID": ["cf3b4d1c-5a4b-4adf-ac6a-444b50864bc9", "d8c96898-0d5b-403e-94cd-2001161d7166"]
            }
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
        }
      },
           
      "date_histogram": {
        "field": "date",
        "interval": "hour"
      }
    }
  }
};