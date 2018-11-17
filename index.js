const express = require('express')
const app = express();
const favicon = require('serve-favicon');
const http = require('http');


// First just check that PORT is set, otherwise exit
if (!process.env.PORT) {
  console.log("Error:  PORT env variable not set.");
  process.exit(1);
}

app.on("error", error => console.log("The server encountered an error!"));

app.use(express.static('public'))
app.use(favicon(__dirname + '/public/images/favicon-96x96.png'));

http.createServer(app).listen( process.env.PORT, function(){
  console.log("Server started listening on port " + process.env.PORT);
})
.on( 'error', function (e) { 
  if (e.code == 'EADDRINUSE') { 
    console.log('Cannot start server.  Port '+process.env.PORT+' already in use.');
  }
});
