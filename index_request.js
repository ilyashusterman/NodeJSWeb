var fs = require('fs');
var pipeIndexRequest = function(server){
    server.on('request', function(request, response){
        response.writeHead(200, {'Content-Type': 'text/html'});
        var file = fs.createReadStream('index.html');
        file.pipe(response);
    });
}

module.exports = pipeIndexRequest;