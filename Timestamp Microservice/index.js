// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// timestamp API
datePath = '/api/:date?';
app.get(datePath, (req, res) => {
  let { date } = req.params;
  
  // check if no parameter was passed
  if (!date) {
    date = Date.now(); // in that case, assign the date as right now
  }

  let timestamp;
  let utc;

  // check if the provided date is a valid unix timestamp
  if (!isNaN(date)) {
    timestamp = parseInt(date); // convert date string to a number
    utc = new Date(timestamp).toUTCString(); // convert number to utc date format
  } else {
    // otherwise treat it as a date string
    timestamp = Date.parse(date); // convert date string to timestamp in milliseconds
    utc = new Date(date).toUTCString(); // convert date to utc date format
  }

  // check if the provided date is valid
  if (!isNaN(timestamp)) {
    res.json({ unix: timestamp, utc });
  } else {
    res.json({ error: "Invalid date" });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
