const express = require('express');
const helloRouter = express.Router();

helloRouter.get('/', function (req, res) {
  res.json({greeting: 'Hello router!'});
});

module.exports = helloRouter;
