/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var fs = require('fs');
var path = require('path');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};



var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.

    // fs.readdir(path.resolve(__dirname + '/../client/rpt05-chatterbox-client-solution'),'utf8' , function(err, data) {
    //   response.writeHead(200, {'Content-Type': 'text/html'});
    //   console.log(data)
    //   response.write(data);
    //   // response.end();
    // });

// var data = fs.readFileSync(path.resolve(__dirname, 'index.html'),'utf8');
// console.log(data)
// console.log(path.resolve(__dirname, 'index.html'))
// console.log(process.argv[1])


  fs.readFile(path.resolve(__dirname, 'messages.js'),'utf8', function(err, data) {
    var messages = JSON.parse(data);

    var writingFunction = function() {
      fs.writeFile(path.resolve(__dirname, 'messages.js'), JSON.stringify(messages), (err) => {
        if (err) throw err;
        console.log('Lyric saved!');
      });
    }


    if(request.url.split('?')[0].toString() !== '/classes/messages') {
      var statusCode = 404;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end();
    }

    var statusCode;

    if (request.method === 'POST') {
      request.on('data', function(data){

        var dataToString = data.toString();
        console.log(messages.results)
        if (dataToString.indexOf('&') === -1 && dataToString.indexOf('=') === -1) {
          var objParsed = JSON.parse(data);
          objParsed.objectId = Math.random() * 12345;
          messages.results.push(objParsed);

        } else {
          var arrayOfProperties = dataToString.split('&');
          var obj = {};
          arrayOfProperties.forEach(function(string){
            var ar = string.split('=');
            obj[ar[0]] = ar[1];
          });

          obj.objectId = Math.random() * 12345;
          messages.results.push(obj);
          writingFunction();
          console.log(messages)
        }

      });
      statusCode = 201;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end();

    } else {
      // See the note below about CORS headers.

      statusCode = 200;
      var headers = defaultCorsHeaders;

      // Tell the client we are sending them plain text.
      //
      // You will need to change this if you are sending something
      // other than plain text, like JSON or HTML.
      headers['Content-Type'] = 'text/json';
      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(messages));
    }

  });

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;




