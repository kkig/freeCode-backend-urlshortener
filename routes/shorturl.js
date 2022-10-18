const db = require('express');
const dns = require('node:dns');

// Handles requests made to /api/shorturlRouter
const shorturlRouter = db.Router();

// Model
const Shorturl = require('../models/shorturl');

const testUrl = new Shorturl({
  // field should be less than 12 digit number (from 0 to 999,999,999,999)
  _id: Math.floor(Math.random() * 1000000000000),
  original_url: 'https://www.example.com',
});
console.log(testUrl);

// Routes
shorturlRouter.get('/', function (req, res) {
  res.send({greeting: 'Route works!'});
});

shorturlRouter.post('/', function (req, res) {
  // Verify URL
  try {
    const targetUrl = new URL(req.body.url);
    console.log(targetUrl);
  } catch {
    res.json({error: 'Please check URL format!'});
  }

  const options = {
    all: true,
  };

  dns.lookup(targetUrl.hostname, options, function (err, address) {
    if (err) {
      // DNS error
      console.log('DNS error!');

      res.json({error: err});
    } else {
      // DNS found
      console.log(address);

      // Check collisions
      Shorturl.countDocuments(
        {original_url: req.body.url},
        function (err, data) {
          // Handle error
          if (err) return console.log(err);

          if (data > 0) {
            // Match in doc
            res.json({error: 'Please send new URL!'});
          } else {
            // No match in doc
            res.json({
              original_url: req.body.url,
            });
          }
        }
      );
    }
  });
});

module.exports = shorturlRouter;
