if (!process.env.accountKeys) {
  throw new Error('Please provide account key(s) (space-separated)');
}

import crypto from 'crypto';
import { Agent, request, interceptors } from 'undici';

const agent = new Agent()
  .compose(
    // Vercel sin1 can't reach some IPv6 routes (EADDRNOTAVAIL); stick to IPv4.
    interceptors.dns({ maxTTL: 3600000, dualStack: false, affinity: 4 }),
  )
  .compose(
    interceptors.retry({
      maxRetries: 1,
      // One fixed wait at minTimeout; timeoutFactor inert until maxRetries >= 2.
      // maxTimeout also caps Retry-After (30s default would exceed maxDuration).
      minTimeout: 500,
      maxTimeout: 2000,
      timeoutFactor: 2,
      // Default throwOnError=true rethrows 5xx instead of retrying them.
      throwOnError: false,
      // Default list includes 429; don't retry rate limits.
      statusCodes: [500, 502, 503, 504],
    }),
  );

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

// Round coordinates to max 6 decimal places (~0.1m precision, good enough
// for bus locations and keeps payloads small). Preserves non-finite values.
const round6 = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) ? Math.round(n * 1e6) / 1e6 : n;
};

const arrivalResponse = (bus, now) => {
  const arrival = bus.EstimatedArrival;
  if (!arrival) return null;
  return {
    time: arrival,
    duration_ms: Date.parse(arrival) - now,
    lat: round6(bus.Latitude),
    lng: round6(bus.Longitude),
    load: bus.Load,
    feature: bus.Feature,
    type: bus.Type,
    visit_number: +bus.VisitNumber,
    origin_code: bus.OriginCode,
    destination_code: bus.DestinationCode,
    monitored: bus.Monitored,
  };
};

export default async function handler(req, res) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-credentials', 'true');

  // Default for error responses; branches below override.
  res.setHeader('cache-control', 's-maxage=5, max-age=5');

  if (
    req.method === 'OPTIONS' &&
    req.headers['access-control-request-headers']
  ) {
    res.statusCode = 204;
    res.setHeader('cache-control', 's-maxage=86400, max-age=86400');
    res.setHeader('access-control-max-age', '86400');
    res.end();
    return;
  }

  res.setHeader('content-type', 'application/json');

  let id = req.query?.id;
  if (Array.isArray(id)) id = id[0];
  if (typeof id !== 'string') {
    // Fallback when req.query missing
    id = new URL(req.url, 'http://fauxbase/').searchParams.get('id');
  }
  id = id?.trim();
  if (!id) {
    res.setHeader('cache-control', 's-maxage=300, max-age=300');
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
  if (!/^\d{5}$/.test(id)) {
    res.end(JSON.stringify({ error: 'Invalid bus stop code.', statusCode: 400 }));
    return;
  }

  console.log('🚌  ' + id);

  const apiURL = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${id}`;
  const AccountKey = getAccountKey();
  console.log(`[${AccountKey.slice(0, 4)}] ↗️  ${apiURL}`);

  let body;
  try {
    const { statusCode, body: responseBody } = await request(apiURL, {
      method: 'GET',
      headers: { AccountKey },
      dispatcher: agent,
      headersTimeout: 4000,
      bodyTimeout: 4000,
    });
    body = await responseBody.json();

    if (statusCode !== 200) {
      const errorMessage =
        body?.message || body?.error || 'Failed to retrieve bus data.';
      res.end(JSON.stringify({ error: errorMessage, statusCode }));
      return;
    }

    if (!body) {
      res.end(JSON.stringify({ error: 'No bus arrival data received.' }));
      return;
    }
  } catch (error) {
    console.error('Error fetching bus data:', error);
    res.end(
      JSON.stringify({
        error:
          'Unable to retrieve bus arrival information. The service may be temporarily unavailable.',
      }),
    );
    return;
  }

  const now = Date.now();

  const services = body.Services.map((service) => {
    const { NextBus, NextBus2, NextBus3 } = service;

    const next2 = arrivalResponse(NextBus2, now);
    return {
      no: service.ServiceNo,
      operator: service.Operator,
      next: arrivalResponse(NextBus, now),
      subsequent: next2, // Legacy alias
      next2,
      next3: arrivalResponse(NextBus3, now),
    };
  });

  res.setHeader('cache-control', 's-maxage=15, max-age=15');
  res.end(JSON.stringify({ services }));
}
