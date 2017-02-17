/**
 * Created by ilya on 16/02/2017.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();
var ip;

var messages = [];

var storeMessage = function(name, data){
    var message =JSON.stringify({name: name, data: data});
    redisClient.lpush("messages", message, function (err, response) {
       redisClient.ltrim("messages", 0, 9);
    });
    // messages.push({name: name, data: data});
    // if(messages.length >10){
    //     messages.shift();
    // }
}
//var request = require('request');
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
       //client.broadcast.emit("add chatter", name);
       io.emit('add chatter',name);
       redisClient.smembers('names', function (err, names) {
           names.forEach(function (name) {
               client.emit('add chatter', name);
           });
       });
       redisClient.sadd("chatters", name);
       redisClient.lrange("messages", 0, -1, function (err, messages) {
           messages = messages.reverse();
       messages.forEach(function (message) {
           message = JSON.parse(message);
           client.emit("messages", message.name+ ": "+ message.data);
       });
       });
   });
   client.on('messages', function (message) {
       var nickname = client.nickname;
       if (nickname === "" || nickname === undefined){
           nickname ="undefined";
           console.log(ip+" connected");
       }
          // client.broadcast.emit("messages", nickname + " : " + message);
            io.emit('messages', nickname + " " + ": " + message);
           storeMessage(nickname, message);
     //  client.emit("messages", nickname+": "+ message);
   });

   client.on('disconnect', function (name) {
       var nickname = client.nickname;
       console.log(nickname+" has disconnected");
       io.emit("remove chatter", nickname);
      // client.broadcast.emit("remove chatter", nickname);
       redisClient.srem("chatters", name);
       // client.get('nickname', function (err, name) {
       //     client.broadcast.emit("remove chatter", name);
       //     redisClient.srem("chatters", name);
       // });
   });
});
//some changes
app.use(express.static(__dirname));
app.get('/', function (req, res) {
    ip = req.headers['x-forwarded-for'];
    console.log("hello got connected");
    res.sendFile(__dirname+'/index.html');
});

server.listen(8080);