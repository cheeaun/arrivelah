require('dotenv').config();

const Koa = require('koa');
const cors = require('kcors');
const retry = require('async-retry')
const fetch = require('node-fetch');
const cache = require('lru-cache')({
  maxAge: 1000 * 15 // 15 seconds
});
setInterval(() => cache.prune(), 1000 * 60); // Prune every minute

const app = new Koa();
app.use(cors());

app.use(async (ctx) => {
  const { id } = ctx.request.query;

  if (!id){
    ctx.body = {
      name: 'arrivelah',
      project_url: 'https://github.com/cheeaun/arrivelah',
      instruction: 'Bus stop code (`id` URL parameter) is required. E.g.: `/?id=83139`. List of the codes here: https://github.com/cheeaun/busrouter-sg/blob/master/data/2/bus-stops.geojson',
      current_bus_arrival_queries: cache.keys(),
    };
    return;
  }

  let services = cache.get(id);
  console.log('🚌  ' + id);

  if (!services){
    const url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=' + id;
    console.log('Fetch ' + url);
    await retry(async () => {
      const result = await fetch(url, {
        timeout: 1000 * 10, // 10 seconds
        headers: {
          AccountKey: process.env.accountKey,
        },
      }).then(async (res) => ({
        statusCode: res.status,
        body: await res.json(),
      }));

      if (result.statusCode !== 200 || !result.body){
        ctx.body = {
          error: 'Invalid bus stop ID provided.'
        };
        return;
      }

      services = result.body.Services.map((service) => {
        const { NextBus, SubsequentBus } = service;
        const nextArrival = NextBus.EstimatedArrival;
        const subsequentArrival = SubsequentBus.EstimatedArrival;
        const now = Date.now();

        return {
          no: service.ServiceNo,
          next: {
            time: nextArrival,
            duration_ms: nextArrival ? (new Date(nextArrival) - now) : null,
            lat: parseFloat(NextBus.Latitude, 10),
            lng: parseFloat(NextBus.Longitude, 10),
            load: NextBus.Load,
            feature: NextBus.Feature,
          },
          subsequent: {
            time: subsequentArrival,
            duration_ms: subsequentArrival ? (new Date(subsequentArrival) - now) : null,
            lat: parseFloat(SubsequentBus.Latitude, 10),
            lng: parseFloat(SubsequentBus.Longitude, 10),
            load: SubsequentBus.Load,
            feature: SubsequentBus.Feature,
          }
        }
      });

      cache.set(id, services);
    }, {
      retries: 3,
    });
  }

  ctx.body = {
    services,
  };
});

const port = process.env.PORT || 8081;
app.listen(port);
console.log('Server started at localhost:' + port);
