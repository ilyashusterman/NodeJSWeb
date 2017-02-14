//The interface is careful to never buffer entire requests or responses--the user is able to stream data.
var http = require('http'); //how to require modules
//File I/O is provided by simple wrappers around standard POSIX functions. 
var fs = require('fs');
//When the EventEmitter object emits an event, all of the functions attached to that specific event are called synchronously. 
var EventEmitter = require('events').EventEmitter;
//App logger example event
var logger = new EventEmitter();
//App chat example event
var chat = new EventEmitter();
var users = [], chatlog = [];

pipeIndexRequest = require('./index_request')
    //listens to message event
chat.on('message', function(message){
  console.log(message);
  chatlog.push(message);
});

chat.on('join', function(nickname) {
  users.push(nickname);
});

// Emit events here
chat.emit('join', 'shy');

chat.emit('message', 'shy');

// var server = http.createServer(function(request, response){
//       response.writeHead(200, {'Content-Type': 'text/html'});
//    // response.write('Hello , this is ilya! program is running!');
//     // setTimeout(function() { // explanation of the method call back and non blocking code
//     //     response.write('program done running');
//     //     response.end();
//     // }, 5000); 
//     fs.readFile('index.html', function(error, contents){
//         response.end(contents);
//         logger.emit('info', 'Done reading file');
//         console.log(contents);
//     });

// });

var server = http.createServer();
pipeIndexRequest(server);
// server.on('request', function(request, response){
//      response.writeHead(200, {'Content-Type': 'text/html'});
// // fs.readFile('index.html', function(error, contents){
// //         response.end(contents);
// //         logger.emit('info', 'Done reading index');
// //     });
//       var file = fs.createReadStream('index.html');
//   file.pipe(response);
// });


server.on('request', function(request, response) {
  console.log("New request coming in...");
});

server.on('request', function(request, response) {
  var newFile = fs.createWriteStream("readme_copy.md");
  var fileBytes = request.headers['content-length'];
  var uploadedBytes = 0;
  request.on('readable', function(){
    var chunck = null;
    while(null !== (chunk = request.read())){
      uploadedBytes += chunck.length;
       var progress = (uploadedBytes / fileBytes) *100 ;
       response.write("progress: "+parseInt(progress, 10)+"%\n");
    }
  });
  request.pipe(newFile);
});



server.on('close', function(){
   console.log("Closing down the server...");
});

server.listen(8080);

console.log('listening on port 8080....')



//------------------------------------------------------------File IO

var file = fs.createReadStream("data.txt");
//*this code is deprecated!!*
// file.on('readable', function(){
//   var data = file.read();
//   while(data){
//     console.log(data.toString());
//     data = file.read();
//   }
// });

//console.log("after readable event"); //DEPRECATED
file.pipe(process.stdout);
