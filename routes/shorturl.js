const db = require('express');
const {Schema} = require('mongoose');
const dns = require('node:dns');

// Handles requests made to /api/shorturlRouter
const shorturlRouter = db.Router();

// Model
const Shorturl = require('../models/shorturl');

const {
  verifyUrl,
  countMatch,
  filterAndReturnMatch,
  createAndSaveNewUrl,
} = require('../utils/shorturl');

// const woo = createAndSaveNewUrl();
// console.log('id: ', woo);

// function createAndSaveUrl(url) {
//   let newId = Math.floor(Math.random() * 1000000000000);
//   let collision;
//   const testUrl = new Shorturl({
//     // field should be less than 12 digit number (from 0 to 999,999,999,999)
//     _id: newId,
//     original_url: url,
//   });

//   // Shorturl.find({short_url: 13}, function (err, foundData) {
//   //   console.log(foundData);
//   // });
//   return testUrl;
// }
// console.log(createAndSaveUrl('www.exampleTttwoo.com'));
// Shorturl.find({short_url: 13}, function (err, foundData) {
//   if (err) return console.log(err);
//   console.log(foundData);
// });

// Routes
shorturlRouter.get('/', function (req, res) {
  res.send({greeting: 'Route works!'});
});

shorturlRouter.get('/:short_url', function (req, res) {
  // res.json({ResNum: req.params.short_url});

  Shorturl.findOne({short_url: req.params.short_url}, function (err, foundDoc) {
    if (err) {
      return res.json({error: err});
    }

    if (foundDoc === null) res.json({error: 'invalid short url'});

    res.json(foundDoc);
  });
  // Shorturl.findOne({short_url: req.params.short_url})
});

shorturlRouter.post('/', function (req, res) {
  // Lookup existing url match
  countMatch(req.body.url, function (err, count) {
    if (err) return console.log('Error counting match: ', err);

    const urlEntered = req.body.url;

    // Return existing doc OR create new doc
    if (count === 0) {
      createAndSaveNewUrl(urlEntered, function (err, doc) {
        if (err) console.log(err);

        res.json({
          original_url: doc.original_url,
          short_url: doc.short_url,
          res: 'No match - created new doc.',
        });
      });
    } else {
      filterAndReturnMatch(urlEntered, function (err, doc) {
        if (err) return console.log('Error returning match: ', err);

        // return res.send(doc);
        res.json({
          original_url: doc.original_url,
          short_url: doc.short_url,
          res: 'Match found!',
          resCount: count,
        });
      });
    }
  });

  // Verify URL
  // verifyUrl(req.body.url, function (err, address) {
  //   if (err) {
  //     console.log(err);
  //     return res.json({error: 'invalid url', hints: err.hints});
  //   }

  //   // Invalid form when hostname === null
  //   if (address === null) return res.json({error: 'invalid url'});

  //   res.json({msg: 'Yay!'});
  // });
});

module.exports = shorturlRouter;
