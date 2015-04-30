ArriveLah
===

Fast simple API for bus arrival times in Singapore.

This is like a proxy to [LTA's DataMall Bus Arrival API](http://www.mytransport.sg/content/mytransport/home/dataMall.html).

Development
---

1. Add configuration. Follow documentation from [mytransport.sg DataMall](http://www.mytransport.sg/content/mytransport/home/dataMall.html). Two options (choose one):
  1. Copy and rename `config.example.json` to `config.json`. Edit the file.
  2. Add environment variables.
2. `npm install`
3. `node server.js`
4. Load `locahost`. Change `port` in configuration if `80` doesn't work.

License
---

[MIT](http://cheeaun.mit-license.org/). Data is copyrighted by [LTA](http://www.mytransport.sg/).
