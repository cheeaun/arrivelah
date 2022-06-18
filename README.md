ArriveLah
===

Fast simple API for bus arrival times in Singapore.

This is like a proxy to [LTA's DataMall Bus Arrival API](http://www.mytransport.sg/content/mytransport/home/dataMall.html).

API
---

### Request

```
GET /?id=66271
```

- `id` - (required) Bus stop ID/code

### Response

```json
{
  "services": [
    {
      "no": "136",
      "operator": "GAS",
      "next": {
        "time": "2022-06-18T21:19:43+08:00",
        "duration_ms": 395837,
        "lat": 1.3527008333333335,
        "lng": 103.8770235,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009"
      },
      "subsequent": {
        "time": "2022-06-18T21:33:22+08:00",
        "duration_ms": 1214837,
        "lat": 1.3723343333333333,
        "lng": 103.898075,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009"
      },
      "next2": {
        "time": "2022-06-18T21:33:22+08:00",
        "duration_ms": 1214837,
        "lat": 1.3723343333333333,
        "lng": 103.898075,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009"
      },
      "next3": {
        "time": "2022-06-18T21:51:23+08:00",
        "duration_ms": 2295837,
        "lat": 1.3994908333333334,
        "lng": 103.90791783333333,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009"
      }
    },
    {
      "no": "136",
      "operator": "GAS",
      "next": {
        "time": "2022-06-18T21:30:41+08:00",
        "duration_ms": 1053837,
        "lat": 0,
        "lng": 0,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "65009"
      },
      "subsequent": {
        "time": "2022-06-18T21:49:41+08:00",
        "duration_ms": 2193837,
        "lat": 0,
        "lng": 0,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "65009"
      },
      "next2": {
        "time": "2022-06-18T21:49:41+08:00",
        "duration_ms": 2193837,
        "lat": 0,
        "lng": 0,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "65009"
      },
      "next3": null
    },
    {
      "no": "315",
      "operator": "SBST",
      "next": {
        "time": "2022-06-18T21:13:30+08:00",
        "duration_ms": 22837,
        "lat": 1.3632465,
        "lng": 103.871274,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "66009",
        "destination_code": "66009"
      },
      "subsequent": {
        "time": "2022-06-18T21:22:15+08:00",
        "duration_ms": 547837,
        "lat": 0,
        "lng": 0,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009"
      },
      "next2": {
        "time": "2022-06-18T21:22:15+08:00",
        "duration_ms": 547837,
        "lat": 0,
        "lng": 0,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009"
      },
      "next3": {
        "time": "2022-06-18T21:23:32+08:00",
        "duration_ms": 624837,
        "lat": 1.3752478333333333,
        "lng": 103.869852,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "66009",
        "destination_code": "66009"
      }
    },
    {
      "no": "317",
      "operator": "SBST",
      "next": {
        "time": "2022-06-18T21:20:49+08:00",
        "duration_ms": 461837,
        "lat": 1.3628948333333333,
        "lng": 103.86563566666666,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "66009",
        "destination_code": "66009"
      },
      "subsequent": {
        "time": "2022-06-18T21:21:31+08:00",
        "duration_ms": 503837,
        "lat": 1.3497606666666666,
        "lng": 103.8737135,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009"
      },
      "next2": {
        "time": "2022-06-18T21:21:31+08:00",
        "duration_ms": 503837,
        "lat": 1.3497606666666666,
        "lng": 103.8737135,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009"
      },
      "next3": {
        "time": "2022-06-18T21:32:39+08:00",
        "duration_ms": 1171837,
        "lat": 1.3497606666666666,
        "lng": 103.8737135,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "66009",
        "destination_code": "66009"
      }
    },
    {
      "no": "73",
      "operator": "SBST",
      "next": {
        "time": "2022-06-18T21:13:41+08:00",
        "duration_ms": 33837,
        "lat": 1.3632655,
        "lng": 103.871455,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "54009"
      },
      "subsequent": {
        "time": "2022-06-18T21:20:45+08:00",
        "duration_ms": 457837,
        "lat": 1.3435921666666666,
        "lng": 103.85476483333333,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "54009",
        "destination_code": "54009"
      },
      "next2": {
        "time": "2022-06-18T21:20:45+08:00",
        "duration_ms": 457837,
        "lat": 1.3435921666666666,
        "lng": 103.85476483333333,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "54009",
        "destination_code": "54009"
      },
      "next3": {
        "time": "2022-06-18T21:26:49+08:00",
        "duration_ms": 821837,
        "lat": 1.3712010000000001,
        "lng": 103.86542066666667,
        "load": "SDA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "54009"
      }
    }
  ]
}
```

The responses are cached for **15 seconds**.

Acronyms
---

- `operator`:
  - `SBST` - SBS Transit
  - `SMRT` - SMRT Corporation
  - `TTS` - Tower Transit Singapore
  - `GAS` - Go Ahead Singapore
- `load`:
  - `SEA` - Seats Available
  - `SDA` - Standing Available
  - `LSD` - Limited Standing
- `feature`:
  - `WAB` - Wheelchair Accessible Bus
- `type`:
  - `SD` - Single Deck
  - `DD` - Double Deck
  - `BD` - Bendy

Development
---

1. Add configuration. Follow documentation from [mytransport.sg DataMall](http://www.mytransport.sg/content/mytransport/home/dataMall.html). Two options (choose one):
    1. Copy and rename `.env.example` to `.env`. Edit the file.
    2. Add environment variables.
2. Install [Vercel CLI](https://vercel.com/docs/cli).
3. `npm install`
4. `npm start`

License
---

[MIT](http://cheeaun.mit-license.org/). Data is copyrighted by [LTA](http://www.mytransport.sg/).
