require('dotenv').config();

const Koa = require('koa');
const convert = require('koa-convert');
const cors = require('koa-cors');
const cash = require('koa-cash');
const got = require('got');
const cache = require('lru-cache')({
  maxAge: 1000 * 15 // 15 seconds
});

const app = new Koa();
app.use(convert(cors()));
app.use(convert(cash({
  threshold: 100, // 100 bytes
  get(key){
    return cache.get(key)
  },
  set(key, value){
    cache.set(key, value)
  }
})));

app.use(async (ctx) => {
  if (await ctx.cashed()) return;

  const query = ctx.request.query;
  const id = query.id;

  if (!id){
    ctx.body = {
      error: 'Bus stop ID is not provided. \'id\' URL parameter required. E.g.: `/?id=83139`'
    };

    return;
  }

  const result = await got('http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=' + id, {
    json: true,
    headers: {
      AccountKey: process.env.accountKey,
    }
  });

  if (result.statusCode !== 200 || !result.body){
    ctx.body = {
      error: 'Invalid bus stop ID provided.'
    };

    return;
  }

  const services = result.body.Services.map((service) => {
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

  ctx.body = {
    services,
  };
});

const port = process.env.PORT || 8081;
app.listen(port);
console.log('Server started at localhost:' + port);
