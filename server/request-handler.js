var fs = require('fs');
var path = require('path');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'application/json'
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, defaultCorsHeaders);
  response.end(JSON.stringify(data));
};

var collectData = function(request, callback) {
  var data = '';
  request.on('data' , function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};

var createMessageObj = function(data){
  var arrayOfProperties = data.toString().split('&');
  var obj = {};
  arrayOfProperties.forEach(function(string){
    var ar = string.split('=');
    obj[ar[0]] = ar[1];
  });
  obj.objectId = Math.random() * 12345;
  return obj;
}

var writingFunction = function(messages) {
  fs.writeFile(path.resolve(__dirname, 'messages.js'), JSON.stringify(messages), (err) => {
    if (err) throw err;
    console.log('Lyric saved!');
  });
}

var actions = {
  'GET': function(request, response, messages){
    sendResponse(response, messages, 200)
  },
  'POST': function(request, response, messages){
    collectData(request, function(data){
      var obj = createMessageObj(data)
      messages.results.push(obj);
      writingFunction(messages);
      console.log(messages)
      sendResponse(response, messages, 201)
    })
  },
  'OPTIONS': function(request, response){
    sendResponse(response, null, 200)
  }
}

var requestHandler = function(request, response) {
  fs.readFile(path.resolve(__dirname, 'messages.js'),'utf8', function(err, data) {
    var messages = JSON.parse(data);
    var action = actions[request.method];
      action && action(request, response, messages)
  });
};

exports.requestHandler = requestHandler;
exports.sendResponse = sendResponse
