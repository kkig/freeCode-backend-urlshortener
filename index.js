require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes');

// Basic Configuration
const port = process.env.PORT || 3000;

// Connect to MongoDB
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((err) => console.log(`Database connection error: ${err}`));

// Built-in middleware functions
app.use(express.urlencoded({extended: false})); // Support URL-encoded POST bodies
app.use(express.json()); // Support JSON-encoded POST bodies

// Router
app.use('/api', apiRouter);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
