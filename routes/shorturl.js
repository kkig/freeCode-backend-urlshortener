const db = require('express');
const {Schema} = require('mongoose');
const dns = require('node:dns');

// Handles requests made to /api/shorturlRouter
const shorturlRouter = db.Router();

// Model
const Shorturl = require('../models/shorturl');

const {verifyUrl} = require('../utils/shorturl');

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

shorturlRouter.post('/', function (req, res) {
  // Verify URL
  verifyUrl(req.body.url, function (err, data) {
    if (err) {
      console.log(err);
      return res.json({error: 'invalid url', hints: err.hints});
    }
    console.log(data);
  });

  // Verify URL with DNS
  // const options = {
  //   family: 6,
  // };

  // dns.lookup(targetUrl.hostname, options, function (err, address) {
  //   if (err) {
  //     // DNS error
  //     console.log('DNS error!');

  //     res.json({error: err});
  //   } else {
  //     // DNS found
  //     console.log(address);

  //     const newUrl = new Shorturl({
  //       original_url: req.body.url,
  //       short_url: Schema.Types.ObjectId,
  //     });

  //     // newUrl.short_url = Number(newUrl.id);

  //     console.log(newUrl);

  //     newUrl.save(function (err, dataSaved) {
  //       if (err) {
  //         if (err.code === 11000) {
  //           console.log('There is duplicate!');
  //           // There is duplicate URL in the collection
  //           Shorturl.findOne(
  //             {original_url: newUrl.original_url},
  //             function (err, docFound) {
  //               if (err) return res.json({error: err});

  //               res.redirect(docFound.original_url);
  //             }
  //           );
  //         } else {
  //           res.json({error: err});
  //         }
  //       } else {
  //         // Duplicate not found
  //         res.json({msg: 'New data!'});
  //       }
  //     });
  //   }
  // });
});

module.exports = shorturlRouter;
