require('dotenv').config();

if (!process.env.accountKeys) {
  throw new Error('Please provide account key(s) (space-separated)');
}

const crypto = require('crypto');
const url = require('url');
const got = require('got');
const HttpAgent = require('agentkeepalive');
const { HttpsAgent } = HttpAgent;
const httpAgent = new HttpAgent();
const httpsAgent = new HttpsAgent();
const http2wrapper = require('http2-wrapper');
const http2Agent = new http2wrapper.Agent();

const isDev = !process.env.VERCEL_REGION;

const accountKeys = process.env.accountKeys.split(/\s+/);
const getAccountKey = () => {
  // let accountKeyIndex = Math.floor(Math.random() * accountKeys.length);
  // https://stackoverflow.com/a/33627342/20838
  const accountKeyIndex = Math.floor(
    (parseInt(crypto.randomBytes(1).toString('hex'), 16) / 256) *
      accountKeys.length,
  );
  return accountKeys[accountKeyIndex];
};

async function handler(req, res) {
  const url = new URL(req.url, 'http://fauxbase/');

  res.setHeader('vary', 'origin');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-credentials', 'true');

  if (
    req.method.toLowerCase() === 'options' &&
    req.headers['access-control-request-headers']
  ) {
    // Preflight
    res.status = 204;
    res.end();
    return;
  }

  res.setHeader('content-type', 'application/json');

  const id = url.searchParams.get('id');
  if (!id) {
    res.end(
      JSON.stringify({
        name: 'arrivelah',
        project_url: 'https://github.com/cheeaun/arrivelah',
        instruction:
          'Bus stop code (`id` URL parameter) is required. E.g.: `/?id=83139`. List of bus stops: https://observablehq.com/@cheeaun/list-of-bus-stops-in-singapore',
      }),
    );
    return;
  }

  console.log('🚌  ' + id);

  const apiURL =
    'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' +
    id;
  const AccountKey = getAccountKey();
  console.log(`[${AccountKey.slice(0, 4)}] ↗️  ${apiURL}`);
  const { body, statusCode } = await got(apiURL, {
    responseType: 'json',
    timeout: 1000 * 10, // 10 seconds
    retry: 3,
    headers: {
      AccountKey,
      Connection: 'keep-alive',
    },
    agent: {
      http: httpAgent,
      https: httpsAgent,
      http2: http2Agent,
    },
  });

  if (statusCode !== 200 || !body) {
    res.end(
      JSON.stringify({
        error: 'Invalid bus stop ID provided.',
      }),
    );
    return;
  }

  const now = Date.now();
  const arrivalResponse = (bus) => {
    const arrival = bus.EstimatedArrival;
    return {
      time: arrival,
      duration_ms: arrival ? new Date(arrival) - now : null,
      lat: parseFloat(bus.Latitude, 10),
      lng: parseFloat(bus.Longitude, 10),
      load: bus.Load,
      feature: bus.Feature,
      type: bus.Type,
    };
  };

  const services = body.Services.map((service) => {
    const { NextBus, NextBus2, NextBus3 } = service;

    return {
      no: service.ServiceNo,
      operator: service.Operator,
      next: arrivalResponse(NextBus),
      subsequent: arrivalResponse(NextBus2), // Legacy pre
      next2: arrivalResponse(NextBus2),
      next3: arrivalResponse(NextBus3),
    };
  });

  res.setHeader('cache-control', 's-maxage=15, max-age=15');
  res.end(JSON.stringify({ services }));
}

module.exports = handler;

if (isDev) {
  const PORT = process.env.PORT || 8081;
  const listen = () => console.log(`Listening on ${PORT}...`);
  require('http').createServer(handler).listen(PORT, listen);
  console.log('Server started at port ' + PORT);
}
