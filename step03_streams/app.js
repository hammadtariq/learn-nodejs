
var http = require('http');

//handling custom streams (read and write)
function customStreams(request,response) {
    response.writeHead(200);
    request.on('data',function (chunk) {
        console.log('chunk: ',chunk.toString());
        response.write(chunk);
    })
    request.on('end',function() {
        response.end()
    });
}

//pipe handle all stream by itself
function autoStreams(request,response) {
    response.writeHead(200);
    request.pipe(response);
}

// using stream read and write file on disk
var fs = require('fs');
var file = fs.createReadStream("readme_copy.md")
var newFile = fs.createWriteStream("readme_copy.md")
file.pipe(newFile);

// read file from client provided and write it on disk
function readFile(request,response) {
    var newFile = fs.createWriteStream("readme_copy.md")
    request.pipe(newFile);
    request.on('end',function() {
        response.end("uploaded!");
    });
}

var server = http.createServer(autoStreams).listen(8080)
console.log("server listening on port 8080");