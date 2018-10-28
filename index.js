const express = require('express')
const app = express();
const favicon = require('serve-favicon');

// First just check that PORT is set, otherwise exit
if (!process.env.PORT) {
  console.log("Error:  PORT env variable not set.");
  process.exit(1);
}

app.use(express.static('public'))
app.use(favicon(__dirname + '/public/images/favicon-96x96.png'));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
