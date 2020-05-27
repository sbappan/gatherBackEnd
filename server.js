const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const db = require('./db');

const server = express();
const port = process.env.PORT || 5000;
const dbName = process.env.DB_NAME;

server.use(cors());
server.use(bodyParser.json());

function getAllItems(dbCollection, request, response) {
  dbCollection.find().toArray((error, result) => {
    if (error) throw error;
    response.json(result);
  });
}

function getOneItem(dbCollection, request, response, itemId) {
  dbCollection.findOne({ _id: new ObjectID(itemId) }, (error, result) => {
    if (error) throw error;
    response.json(result);
  });
}

server.get('/', (request, response) => {
  response.end('<h1>Hello World. Welcome to the Gather API.</h1>');
});

// DB init

db.initialize(
  dbName,
  'users',
  function(dbCollection) {
    // successCallback
    // get all users
    dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
      //   console.log(result);
    });

    server.get('/users', (request, response) => {
      getAllItems(dbCollection, request, response);
    });

    server.get('/users/:id', (request, response) => {
      getOneItem(dbCollection, request, response, request.params.id);
    });
  },
  function(err) {
    // failureCallback
    throw err;
  }
);

db.initialize(
  dbName,
  'groups',
  function(dbCollection) {
    // get all groups
    dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
      //   console.log(result);
    });

    server.get('/groups', (request, response) => {
      getAllItems(dbCollection, request, response);
    });

    server.get('/groups/:id', (request, response) => {
      getOneItem(dbCollection, request, response, request.params.id);
    });
  },
  function(err) {
    throw err;
  }
);

db.initialize(
  dbName,
  'events',
  function(dbCollection) {
    // get all events
    dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
      //   console.log(result);
    });

    server.get('/events', (request, response) => {
      getAllItems(dbCollection, request, response);
    });

    server.get('/events/:id', (request, response) => {
      getOneItem(dbCollection, request, response, request.params.id);
    });
  },
  function(err) {
    throw err;
  }
);

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
