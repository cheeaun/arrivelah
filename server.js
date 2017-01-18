var nconf = require('nconf');
var koa = require('koa');
var cors = require('koa-cors');
var request = require('co-request');
var cash = require('koa-cash');
var cache = require('lru-cache')({
  maxAge: 1000 * 15 // 15 seconds
});

nconf.env()
  .file({ file: 'config.json' })
  .defaults({ port: 80 });

var app = koa();
app.use(cors());
app.use(cash({
  threshold: 100, // 100 bytes
  get: function* (key){
    return cache.get(key)
  },
  set: function* (key, value){
    cache.set(key, value)
  }
}));

app.use(function* (){
  if (yield this.cashed()) return;

  var query = this.request.query;
  var id = query.id;

  if (!id){
    this.body = {
      error: 'Bus stop ID is not provided. "id" URL parameter required.'
    };

    return;
  }

  var result = yield request({
    uri: 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=' + id,
    json: true,
    headers: {
      AccountKey: nconf.get('accountKey'),
    }
  });

  if (result.statusCode !== 200 || !result.body){
    this.body = {
      error: 'Invalid bus stop ID provided.'
    };

    return;
  }

  var services = result.body.Services.map(function(service){
    var nextArrival = service.NextBus.EstimatedArrival;
    var subsequentArrival = service.SubsequentBus.EstimatedArrival;
    var now = Date.now();

    return {
      no: service.ServiceNo,
      next: {
        time: nextArrival,
        duration_ms: nextArrival ? (new Date(nextArrival) - now) : null,
      },
      subsequent: {
        time: subsequentArrival,
        duration_ms: subsequentArrival ? (new Date(subsequentArrival) - now) : null
      }
    }
  });

  this.body = {
    services: services
  };
});

app.listen(nconf.get('PORT') || nconf.get('port'));
