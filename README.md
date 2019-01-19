ArriveLah
===

Fast simple API for bus arrival times in Singapore.

This is like a proxy to [LTA's DataMall Bus Arrival API](http://www.mytransport.sg/content/mytransport/home/dataMall.html).

API
---

### Request

```
GET /?id=83139
```

- `id` - (required) Bus stop ID/code

### Response

```json
{
  "services": [
    {
      "no": "15",
      "next": {
        "time": "2017-07-18T01:30:37+00:00",
        "duration_ms": -34445,
        "lat": 1.3148358333333334,
        "lng": 103.90915083333333,
        "load": "Standing Available",
        "feature": "WAB"
      },
      "subsequent": {
        "time": "2017-07-18T01:36:11+00:00",
        "duration_ms": 299555,
        "lat": 1.3265658333333334,
        "lng": 103.9059575,
        "feature": "WAB"
      }
    },
    {
      "no": "150",
      "next": {
        "time": "2017-07-18T01:32:44+00:00",
        "duration_ms": 92555,
        "lat": 1.3196148333333333,
        "lng": 103.9014965,
        "load": "Seats Available",
        "feature": "WAB"
      },
      "subsequent": {
        "time": "2017-07-18T01:51:16+00:00",
        "duration_ms": 1204555,
        "lat": 0,
        "lng": 0,
        "feature": "WAB"
      }
    },
    {
      "no": "155",
      "next": {
        "time": "2017-07-18T01:32:36+00:00",
        "duration_ms": 84555,
        "lat": 1.319155,
        "lng": 103.90471016666666,
        "load": "Seats Available",
        "feature": "WAB"
      },
      "subsequent": {
        "time": "2017-07-18T01:43:18+00:00",
        "duration_ms": 726555,
        "lat": 1.3189929999999999,
        "lng": 103.88656266666666,
        "feature": "WAB"
      }
    }
  ]
}
```

The responses are cached for **15 seconds**.

Development
---

1. Add configuration. Follow documentation from [mytransport.sg DataMall](http://www.mytransport.sg/content/mytransport/home/dataMall.html). Two options (choose one):
  1. Copy and rename `.env.example` to `.env`. Edit the file.
  2. Add environment variables.
2. `npm install`
3. `npm start`
4. Load `locahost:8081`. Change `PORT` in configuration if it doesn't work.

License
---

[MIT](http://cheeaun.mit-license.org/). Data is copyrighted by [LTA](http://www.mytransport.sg/).
