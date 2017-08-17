require('dotenv').config();

const Koa = require('koa');
const cors = require('kcors');
const got = require('got');
const cache = require('lru-cache')({
  maxAge: 1000 * 15 // 15 seconds
});

const app = new Koa();
app.use(cors());

app.use(async (ctx) => {
  const { id } = ctx.request.query;

  if (!id){
    ctx.body = {
      error: 'Bus stop ID is not provided. \'id\' URL parameter required. E.g.: `/?id=83139`'
    };
    return;
  }

  let services = cache.get(id);
  console.log('🚌  ' + id);

  if (!services){
    const url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=' + id;
    console.log('Fetch ' + url);
    const result = await got(url, {
      json: true,
      timeout: 1000 * 10, // 10 seconds
      headers: {
        AccountKey: process.env.accountKey,
      },
    });

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
  }

  ctx.body = {
    services,
  };
});

const port = process.env.PORT || 8081;
app.listen(port);
console.log('Server started at localhost:' + port);
