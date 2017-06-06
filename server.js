var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log('request for ' + pathname + ' received.');
        route(handle, pathname, response, request);
    }
    http.createServer(onRequest, 'hello world').listen(8090);
    console.log('server start at 8090!')

}
exports.start = start;
