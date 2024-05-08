require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// include middleware to parse post requests
const bodyParser = require("body-parser");
// include valid-url for url validation
const validUrl = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const shorturl = '/api/shorturl';
// database dictionary to store created shorturls
const urlDb = {};

// var to act as the shortened url
let shorturlId = 0;

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

app.post(shorturl, (req, res) => {
  const originalUrl = req.body.url;
   
  // validate the URL format
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  // add one to the short-id value and assign it as the short-url
  const shortUrl = ++shorturlId;

  // store the URL mapping
  urlDb[shortUrl] = originalUrl;

  // send JSON response with original and short URLs
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get(shorturl+'/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;

  // lookup the original URL from the database
  const originalUrl = urlDb[shortUrl];

  // If not found, return an error
  if (!originalUrl) {
    return res.status(404).json({ error: 'invalid url' });
  }

  // otherwise, redirect to the original URL
  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
