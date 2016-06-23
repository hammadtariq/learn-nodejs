var express = require('express');
var socket = require('socket.io');
var app = express();
var server = require('http').Server(app);
var io = socket(server)
//shorter way
// var app = require('express')();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

app.get('/',function(req,res) {
    res.sendFile(__dirname+"/index.html");
})

io.on("connection",function(client) {
    console.log('Client Connected.. ');
    var username = '';
    
    client.on('join',function(name){
        client.set('nickname',name);
        username = name;
    })

    client.on('messages',function(data){
        console.log("message from client: ",data)
        client.get('nickname',function(err,name){
            client.volatile.emit("messages",{text:data,name:username})
        })
    })
    
})

server.listen(8080)
