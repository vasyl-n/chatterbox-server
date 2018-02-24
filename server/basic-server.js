/* Import node's http module: */
var http = require('http');
var handleRequest = require('./request-handler');
var path = require('url');
var handleServingFiles = require('./serveFiles')

var port = process.env.PORT || 3000;
console.log(process.env.PORT)
var ip = '127.0.0.1';

var routes = {
  '/classes/messages': handleRequest.requestHandler,
  '/': handleServingFiles.handleIndexHTML,
  '/scripts/app.js': handleServingFiles.handleAppJS,
  '/styles/styles.css': handleServingFiles.handleStyles,
  '/images/spiffygif_46x46.gif': handleServingFiles.handleSpinner
}

var server = http.createServer(function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var url = path.parse(request.url);
  var route = routes[url.pathname];
  route ? route(request, response) : handleRequest.sendResponse(response, 'Not Found', 404);
});

console.log('Listening on http://' + ip + ':' + port);
server.listen(port, ip);
