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
        "time": "2026-10-08T13:02:02+08:00",
        "duration_ms": 456561,
        "lat": 1.352547,
        "lng": 103.876772,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009",
        "monitored": 1
      },
      "subsequent": {
        "time": "2026-10-08T13:10:07+08:00",
        "duration_ms": 941561,
        "lat": 1.362982,
        "lng": 103.888256,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009",
        "monitored": 1
      },
      "next2": {
        "time": "2026-10-08T13:10:07+08:00",
        "duration_ms": 941561,
        "lat": 1.362982,
        "lng": 103.888256,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009",
        "monitored": 1
      },
      "next3": {
        "time": "2026-10-08T13:23:00+08:00",
        "duration_ms": 1714561,
        "lat": 1.381867,
        "lng": 103.903177,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "65009",
        "destination_code": "54009",
        "monitored": 1
      }
    },
    {
      "no": "136",
      "operator": "GAS",
      "next": {
        "time": "2026-10-08T12:59:12+08:00",
        "duration_ms": 286561,
        "lat": 1.354989,
        "lng": 103.859395,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "65009",
        "monitored": 1
      },
      "subsequent": {
        "time": "2026-10-08T13:13:24+08:00",
        "duration_ms": 1138561,
        "lat": 1.368767,
        "lng": 103.849026,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "65009",
        "monitored": 1
      },
      "next2": {
        "time": "2026-10-08T13:13:24+08:00",
        "duration_ms": 1138561,
        "lat": 1.368767,
        "lng": 103.849026,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "65009",
        "monitored": 1
      },
      "next3": {
        "time": "2026-10-08T13:24:52+08:00",
        "duration_ms": 1826561,
        "lat": 0,
        "lng": 0,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "65009",
        "monitored": 0
      }
    },
    {
      "no": "315",
      "operator": "SBST",
      "next": {
        "time": "2026-10-08T12:56:15+08:00",
        "duration_ms": 109561,
        "lat": 1.358464,
        "lng": 103.868258,
        "load": "SDA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 1
      },
      "subsequent": {
        "time": "2026-10-08T13:02:33+08:00",
        "duration_ms": 487561,
        "lat": 1.368716,
        "lng": 103.873912,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 1
      },
      "next2": {
        "time": "2026-10-08T13:02:33+08:00",
        "duration_ms": 487561,
        "lat": 1.368716,
        "lng": 103.873912,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 1
      },
      "next3": {
        "time": "2026-10-08T13:04:10+08:00",
        "duration_ms": 584561,
        "lat": 1.348693,
        "lng": 103.872786,
        "load": "SDA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 1
      }
    },
    {
      "no": "317",
      "operator": "SBST",
      "next": {
        "time": "2026-10-08T12:55:44+08:00",
        "duration_ms": 78561,
        "lat": 1.368876,
        "lng": 103.865647,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 1
      },
      "subsequent": {
        "time": "2026-10-08T12:56:00+08:00",
        "duration_ms": 94561,
        "lat": 1.363675,
        "lng": 103.869086,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 1
      },
      "next2": {
        "time": "2026-10-08T12:56:00+08:00",
        "duration_ms": 94561,
        "lat": 1.363675,
        "lng": 103.869086,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 1
      },
      "next3": {
        "time": "2026-10-08T13:08:22+08:00",
        "duration_ms": 836561,
        "lat": 0,
        "lng": 0,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "66009",
        "destination_code": "66009",
        "monitored": 0
      }
    },
    {
      "no": "73",
      "operator": "SBST",
      "next": {
        "time": "2026-10-08T13:03:21+08:00",
        "duration_ms": 535561,
        "lat": 1.344589,
        "lng": 103.86034,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 2,
        "origin_code": "54009",
        "destination_code": "54009",
        "monitored": 1
      },
      "subsequent": {
        "time": "2026-10-08T13:04:37+08:00",
        "duration_ms": 611561,
        "lat": 1.375065,
        "lng": 103.875393,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "54009",
        "monitored": 1
      },
      "next2": {
        "time": "2026-10-08T13:04:37+08:00",
        "duration_ms": 611561,
        "lat": 1.375065,
        "lng": 103.875393,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "54009",
        "monitored": 1
      },
      "next3": {
        "time": "2026-10-08T13:08:40+08:00",
        "duration_ms": 854561,
        "lat": 1.372799,
        "lng": 103.87172,
        "load": "SEA",
        "feature": "WAB",
        "type": "SD",
        "visit_number": 1,
        "origin_code": "54009",
        "destination_code": "54009",
        "monitored": 1
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
2. Install [Vercel CLI](https://vercel.com/docs/cli) globally: `npm i -g vercel`.
3. `npm install`
4. `npm start`

License
---

[MIT](http://cheeaun.mit-license.org/). Data is copyrighted by [LTA](http://www.mytransport.sg/).
