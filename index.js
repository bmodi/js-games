const express = require('express')
const app = express();

// First just check that PORT is set, otherwise exit
if (!process.env.PORT) {
  console.log("Error:  PORT env variable not set.");
  process.exit(1);
}

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
