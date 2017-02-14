/**
 * Created by ilya on 15/02/2017.
 */
var express = require('express');
var app = express();
var request = require('request');
var url = require('url');

app.get('/', function(request, response){
    response.sendFile(__dirname+"/index.html");
});

app.get('/tweets/:username', function(request, response){
    var username = request.params.username;
    response.send(username);
});

app.listen(8080);