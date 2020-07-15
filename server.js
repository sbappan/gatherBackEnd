const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const passport = require('passport');
require('dotenv').config();

const users = require('./routes/api/users');
const groups = require('./routes/api/groups');
const events = require('./routes/api/events');
const interests = require('./routes/api/interests');

const db = process.env.DATABASE;
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(compression());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

app.use(passport.initialize());

require('./config/passport')(passport);

// Routes
app.use('/api/users', users);
app.use('/api/groups', groups);
app.use('/api/events', events);
app.use('/api/interests', interests);

app.listen(port, () => console.log(`Server up and running on port ${port}!`));
