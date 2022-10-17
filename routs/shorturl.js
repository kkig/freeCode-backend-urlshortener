const express = require('express');

// Handles requests made to /api/shorturlRouter
const shorturlRouter = express.Router();

shorturlRouter.get('/', function (req, res) {
  res.send({greeting: 'Route works!'});
});

shorturlRouter.post('/', function (req, res) {
  res.json(req.body.url);
});

module.exports = shorturlRouter;
