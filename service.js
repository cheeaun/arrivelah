require('dotenv').config();

const url = require('url');
const got = require('got');
const HttpAgent = require('agentkeepalive');
const { HttpsAgent } = HttpAgent;
const httpAgent = new HttpAgent();
const httpsAgent = new HttpsAgent();

const isDev = !process.env.NOW_REGION;

const dnsCache = new Map();
const API_URL = 'http://api.mytransport.sg/ltaodataservice/BusArrivalv2MTM';
const fetchBusArrival = (stop, service) => got(
  `${API_URL}?BusStopCode=${stop}&ServiceNo=${service}`,
  {
    retry: 0,
    dnsCache,
    headers: {
      AccountKey: process.env.myTransportAccountKey,
      Connection: 'keep-alive',
    },
    agent: {
      http: httpAgent,
      https: httpsAgent,
    },
  });

const toFixed = (n, f = 6) => Number(Number(n).toFixed(f));

async function handler(req, res) {
  const URL = url.parse(req.url, true);

  if (URL.pathname === '/favicon.ico') {
    res.status = 204;
    res.end();
    return;
  }

  res.setHeader('vary', 'origin');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-credentials', 'true');

  if (req.method.toLowerCase() === 'options' && req.headers['access-control-request-headers']) {
    // Preflight
    res.status = 204;
    res.end();
    return;
  }

  res.setHeader('content-type', 'application/json');

  const { stops: stopsStr, service, full } = URL.query;
  const stops = [...new Set((stopsStr || '').split(','))].slice(0, 200); // limit to 200
  if (!stopsStr || !stops || !stops.length || !service) {
    res.end(JSON.stringify('Please provide `stops` and `service` parameters'));
    return;
  }

  const timeTag = `🚌 ${service}: ${stops.length} stop(s)`;
  if (isDev) console.time(timeTag);

  Promise.all(stops.map(s => fetchBusArrival(s, service))).then(responses => {
    const results = responses.map(r => JSON.parse(r.body));
    const locations = new Map();
    results.forEach((r, i) => {
      if (!r.Services || !r.Services.length) return;
      const { NextBus } = r.Services[0];
      if (!NextBus) return;
      const now = new Date(r.TimeStamp);
      const { Longitude, Latitude, EstimatedArrival } = NextBus;
      const estimatedArrivalDate = new Date(EstimatedArrival);
      const duration = estimatedArrivalDate - now;

      // If no coordinates, there's no bus
      if (!Longitude || Longitude === '0' || !Latitude || Latitude === '0') {
        if (isDev) console.log('\x1b[31m%s\x1b[0m', `${String(i).padStart(3, ' ')}. ${r.BusStopCode} - NO COORDS`);
        return;
      }

      const lng = toFixed(Longitude);
      const lat = toFixed(Latitude);

      // If duration is negative, the bus already passed the stop
      if (isDev) {
        if (duration < 0) {
          console.log('\x1b[33m%s\x1b[0m', `${String(i).padStart(3, ' ')}. ${r.BusStopCode} - ${duration}ms \t${lng},${lat}`);
        } else {
          console.log('\x1b[36m%s\x1b[0m', `${String(i).padStart(3, ' ')}. ${r.BusStopCode} - ${duration}ms \t${lng},${lat}`);
        }
      }

      const key = lng + ',' + lat;
      if (locations.has(key)) {
        const val = locations.get(key);
        val.stops.push(r.BusStopCode);
        const prevEstimatedArrival = new Date(val.time);
        const prevDuration = prevEstimatedArrival - now;
        if (duration >= 0) { // Only replace if it's a positive duration
          if (prevDuration < 0 || duration < prevDuration) {
            if (isDev) console.log(`\tREPLACE ${val.stop} with ${r.BusStopCode} \t${prevDuration} x ${duration}`);
            val.stop = r.BusStopCode;
            val.time = EstimatedArrival;
          }
        }
        locations.set(key, val);
      } else {
        const val = { lng, lat, stop: r.BusStopCode, stops: [r.BusStopCode], time: EstimatedArrival };
        locations.set(key, val);
      }
      // ['NextBus', 'NextBus2', 'NextBus3'].forEach(b => {
      //   if (!r.Services.length) return;
      //   const { Longitude, Latitude } = r.Services[0][b];
      //   if (!Longitude || Longitude === '0' || !Latitude || Latitude === '0') return;
      //   // console.log(r.BusStopCode, Longitude, Latitude);
      //   locations.add(Longitude + ',' + Latitude);
      // });
    })

    if (isDev) console.timeEnd(timeTag);

    res.setHeader('cache-control', 's-maxage=60, max-age=60');

    let response = [...locations.values()];
    if (!full) {
      response = response.map(r => [r.lng, r.lat]);
    }
    res.end(JSON.stringify(response));
  });
};

exports.default = handler;

if (isDev) {
  const PORT = 8082;
  const listen = () => console.log(`Listening on ${PORT}...`);
  require('http').createServer(handler).listen(PORT, listen);
  console.log('Server started at port ' + PORT);
}