const db = require('express');

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

shorturlRouter.get('/:short_url', function (req, res) {
  Shorturl.findById(req.params.short_url, function (err, foundDoc) {
    if (err) {
      return res.json({error: err});
    }

    if (foundDoc === null) return res.json({error: 'invalid short url'});

    res.redirect(foundDoc.original_url);
  });
});

shorturlRouter.post('/', function (req, res) {
  verifyUrl(req.body.url, function (err, data) {
    if (err) {
      if (err.code === 'ERR_INVALID_URL') {
        return res.json({error: 'invalid url', hint: err.hint || ''});
      } else {
        return res.json({error: err});
      }
    }

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
            short_url: doc.id,
            res: 'No match - created new doc.',
          });
        });
      } else {
        filterAndReturnMatch(urlEntered, function (err, doc) {
          if (err) return console.log('Error returning match: ', err);

          // return res.send(doc);
          res.json({
            original_url: doc.original_url,
            short_url: doc.id,
            res: 'Match found!',
            resCount: count,
          });
        });
      }
    });
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
