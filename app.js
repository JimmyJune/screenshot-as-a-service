/**
 * Module dependencies.
 */
var config = require('config');
var express = require('express');
var RasterizerService = require('./lib/rasterizerService');

// rasterizer
var rastconfig = config.rasterizer;
var rasterizerService = new RasterizerService(rastconfig);
rasterizerService.startService();

process.on('uncaughtException', function (err) {
  console.error("[uncaughtException]", err);
  process.exit(1);
});

process.on('SIGTERM', function () {
  process.exit(0);
});

process.on('SIGINT', function () {
  process.exit(0);
});

// web service
var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/public'))
  app.use(app.router);
  app.set('rasterizerService', rasterizerService);
});
app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
require('./routes')(app);
app.listen(config.server.port);
console.log('Express server listening on port ' + config.server.port);
