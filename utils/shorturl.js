const dns = require('node:dns');

/* Model */
const Shorturl = require('../models/shorturl');

/* Look up URL in doc */
function countMatch(url, done) {
  Shorturl.countDocuments({original_url: url}, function (err, res) {
    if (err) return done(err);

    done(null, res);
  });
}

function filterAndReturnMatch(url, done) {
  Shorturl.findOne({original_url: url}, function (err, doc) {
    if (err) return done(err);

    done(null, doc);
  });
}

/* Generate and save new URL */
function generateNewId() {
  const newId = Math.floor(Math.random() * 1000000000000);

  return newId;
}

function createAndSaveNewUrl(url, done) {
  const newId = generateNewId();

  const data = new Shorturl({original_url: url, short_url: newId});
  done(null, data);
}

/* Verify URL */
const dnsOptions = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPE, // Limits returned address types to the types of non-loopback addresses
};

function verifyUrl(url, done) {
  let targetUrl;

  try {
    targetUrl = new URL(url);

    console.log(targetUrl);
    if (targetUrl.hostname === '')
      return done(new Error('Invalid URL format!'));

    // Lookup DNS
    dns.lookup(targetUrl.hostname, dnsOptions, function (err, address) {
      if (err) {
        err.hints = 'Error finding page.';
        return done(err);
      }
      console.log(address);
      // Page found
      return done(null, address);
    });
  } catch (err) {
    // Invalid input format
    err.hints = 'Please try again. (e.g. https://www.example.com)';
    return done(err);
  }
}

exports.verifyUrl = verifyUrl;
exports.countMatch = countMatch;
exports.filterAndReturnMatch = filterAndReturnMatch;
exports.createAndSaveNewUrl = createAndSaveNewUrl;
// exports.createAndSaveNewUrl = createAndSaveNewUrl;

// Test
exports.generateNewId = generateNewId;
