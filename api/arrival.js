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
      maxRetries: 3,
      minTimeout: 500,
      maxTimeout: 2000,
      timeoutFactor: 2,
      // Default throwOnError=true rethrows 5xx instead of retrying them.
      throwOnError: false,
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

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://fauxbase/');

  res.setHeader('vary', 'origin');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-credentials', 'true');

  if (
    req.method.toLowerCase() === 'options' &&
    req.headers['access-control-request-headers']
  ) {
    res.statusCode = 204;
    res.end();
    return;
  }

  res.setHeader('content-type', 'application/json');

  const id = url.searchParams.get('id')?.trim();
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

  const apiURL = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${id}`;
  const AccountKey = getAccountKey();
  console.log(`[${AccountKey.slice(0, 4)}] ↗️  ${apiURL}`);

  let body;
  try {
    const { statusCode, body: responseBody } = await request(apiURL, {
      method: 'GET',
      headers: { AccountKey },
      dispatcher: agent,
      headersTimeout: 10000,
      bodyTimeout: 10000,
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
  const arrivalResponse = (bus) => {
    const arrival = bus.EstimatedArrival;
    if (!arrival) return null;
    return {
      time: arrival,
      duration_ms: arrival ? new Date(arrival) - now : null,
      lat: parseFloat(bus.Latitude, 10),
      lng: parseFloat(bus.Longitude, 10),
      load: bus.Load,
      feature: bus.Feature,
      type: bus.Type,
      visit_number: Number(bus.VisitNumber),
      origin_code: bus.OriginCode,
      destination_code: bus.DestinationCode,
      monitored: bus.Monitored,
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
