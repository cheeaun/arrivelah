var nconf = require('nconf');
var koa = require('koa');
var cors = require('koa-cors');
var gzip = require('koa-gzip');
var request = require('co-request');

nconf.env().file({ file: 'config.json' }).defaults({ port: 80 });

var app = koa();
app.use(gzip());
app.use(cors());

app.use(function *(){
  var self = this;
  var query = this.request.query;
  var id = query.id;
  if (id){
    var result = yield request({
      uri: 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=' + id,
      json: true,
      headers: {
        AccountKey: nconf.get('accountKey'),
      	UniqueUserId: nconf.get('uniqueUserID')
      }
    });
    if (result.statusCode == 200 && result.body){
      var services = result.body.Services.map(function(service){
        var nextArrival = service.NextBus.EstimatedArrival;
        var subsequentArrival = service.SubsequentBus.EstimatedArrival;
        var now = Date.now();
        return {
          no: service.ServiceNo,
          next: {
            time: nextArrival,
            duration_ms: nextArrival ? (new Date(nextArrival) - now) : null
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
    } else {
      this.body = {
        error: 'Invalid bus stop ID provided.'
      };
    }
  } else {
    this.body = {
      error: 'Bus stop ID is not provided.'
    };
  }
});

app.listen(nconf.get('PORT') || nconf.get('port'));
