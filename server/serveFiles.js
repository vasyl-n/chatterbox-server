var fs = require('fs');
var path = require('path');
var read = require('read-file-relative').read

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, defaultCorsHeaders);
  response.end(data);
};

var handleIndexHTML = function(request, response) {
  // fs.readFile(path.resolve(__dirname, '../client/chatterbox-client/client/index.html'),'utf8',
  read('../client/chatterbox-client/client/index.html', 'utf8',
    function(err, data) {
    response['Content-Type'] = 'text/html';
    sendResponse(response, data, 200)
  });
};

var handleAppJS = function(request, response) {
    fs.readFile(path.resolve(__dirname, '../client/chatterbox-client/client/scripts/app.js'),'utf8', function(err, data) {
    sendResponse(response, data, 200)
  });
}

var handleStyles = function(request, response) {
    fs.readFile(path.resolve(__dirname, '../client/chatterbox-client/client/styles/styles.css'),'utf8', function(err, data) {
      response['Content-Type'] = 'text/css';
    sendResponse(response, data, 200)
  });
}

var handleSpinner = function(request, response) {
    fs.readFile(path.resolve(__dirname, '../client/chatterbox-client/client/images/spiffygif_46x46.gif'),'utf8', function(err, data) {
      response['Content-Type'] = 'image/gif'
      sendResponse(response, data, 200)

  });
}

exports.handleIndexHTML = handleIndexHTML;
exports.handleAppJS = handleAppJS;
exports.handleStyles = handleStyles;
exports.handleSpinner = handleSpinner;