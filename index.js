var server = require('./server');
var route = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {}
handle["/"]=requestHandlers.start;
// handle["/start"]=requestHandlers.start;
handle["/upload"]=requestHandlers.upload;
// handle["/tmp"]=requestHandlers.static;
// handle["/show"]=requestHandlers.show;
// handle["/spaces"]=requestHandlers.spaces;
// handle["/spaces/1/catalogs"]=requestHandlers.catalogs;
// handle["/spaces/2/catalogs"]=requestHandlers.catalog2s;
// handle["/articles/list"]=requestHandlers.getData;
// handle["/articles/1"]=requestHandlers.getAticle;
// handle["/articles/2"]=requestHandlers.getAticle;

server.start(route.route,handle);
