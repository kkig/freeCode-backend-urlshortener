const dns = require('node:dns');
const db = require('express');

/* Model */
const Shorturl = require('../models/shorturl');

function generateNewId() {
  const id = Math.floor(Math.random() * 1000000000000);
  return id;
}

async function createAndSaveNewUrl() {
  const newId = await generateNewId();

  const newUrl = new Shorturl({
    original_url: 'https://www.example.com/aaa',
    // id: '634e1d46ce96ee93fa5bc717',
  });

  newUrl.save(function (err, data) {
    if (err) {
      if (err.code === 11000) return console.log('There is duplicate URL');

      console.log('Error saving doc: ', err);
    }

    console.log(data);
  });

  return newId;
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

    // Lookup DNS
    dns.lookup(targetUrl.hostname, dnsOptions, function (err, address) {
      if (err) {
        err.hints = 'Page not found.';
        return done(err);
      }

      done(null, address);
    });
  } catch (err) {
    // Invalid input format
    err.hints = 'Please try again. (e.g. https://www.example.com)';
    return done(err);
  }
}

exports.verifyUrl = verifyUrl;
exports.createAndSaveNewUrl = createAndSaveNewUrl;
