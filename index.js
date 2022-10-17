require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routs/index');

// Basic Configuration
const port = process.env.PORT || 3000;

// Built-in middleware functions
app.use(express.urlencoded({extended: false})); // Support URL-encoded POST bodies
app.use(express.json()); // Support JSON-encoded POST bodies

app.use('/api', apiRouter);
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
