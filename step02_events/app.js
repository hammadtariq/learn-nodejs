
// Custom event emitters
var eventEmitter = require('events').EventEmitter;
var logger = new eventEmitter();

// Catches event emitted
logger.on('error',function(message) {
    console.log('Err: ',message);
})
// Emits events
logger.emit('error','some thing bad happened!')


// Event emitters provided by http
var http = require('http');

// way 1
function callback(request,response) {
    response.writeHead(200);
    response.write('Hello World');
    response.end();
}
var server = http.createServer(callback).listen(8080)

// way 2
var server = http.createServer().listen(8080)
server.on('request',function (request,response) {
    response.write('request recieved');
})
server.on('close',function (request,response) {
    response.write('server closed');
})

console.log("server listening on port 8080");