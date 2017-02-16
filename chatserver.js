/**
 * Created by ilya on 16/02/2017.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// io.on('connection', function(client){
//     console.log('Client connected...');
//     // client.emit('messages', {hello: 'world'});
//
//     client.on('messages', function (data) {
//         console.log(data);
//         io.emit('messages', data);
//         //client.broadcast.emit('messages', data);
//     });
// });

io.on('connection', function (client) {
   client.on('join', function(name){
    client.nickname = name;
       console.log(client.nickname+" has joined!");
   });
   client.on('messages', function (message) {
       var nickname = client.nickname;
       client.broadcast.emit("message", nickname+" : "+ message);
       io.emit('messages', nickname+" : "+ message)
     //  client.emit("messages", nickname+": "+ message);
   });
});
//some changes
app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
});

server.listen(8080);