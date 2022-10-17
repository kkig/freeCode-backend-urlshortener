const express = require('express');
const apiRouter = express.Router();

const shorturlRouter = require('./shorturl');
const helloRouter = require('./hello');

apiRouter.use('/shorturl', shorturlRouter);
apiRouter.use('/hello', helloRouter);

module.exports = apiRouter;
