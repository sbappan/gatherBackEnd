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

function getAllItems(dbCollection, response) {
  dbCollection.find().toArray((error, result) => {
    if (error) throw error;
    response.json(result);
  });
}

function getOneItemUsingId(dbCollection, response, itemId) {
  dbCollection.findOne({ _id: new ObjectID(itemId) }, (error, result) => {
    if (error) throw error;
    response.json(result);
  });
}

function createOneItem(dbCollection, response, item) {
  dbCollection.insertOne(item, (error, result) => {
    if (error) throw error;
    response.json(result);
  });
}

function updateOneItem(dbCollection, response, item, itemId) {
  dbCollection.updateOne(
    { _id: new ObjectID(itemId) },
    { $set: item },
    (error, result) => {
      if (error) throw error;
      response.json(result);
    }
  );
}

function deleteOneItem(dbCollection, response, itemId) {
  dbCollection.deleteOne({ _id: new ObjectID(itemId) }, (error, result) => {
    if (error) throw error;
    response.json(result);
  });
}

function filterUsingOneId(dbCollection, response, conditionKey, itemId) {
  dbCollection.find({ [conditionKey]: itemId }).toArray((error, result) => {
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
      getAllItems(dbCollection, response);
    });

    server.get('/users/:id', (request, response) => {
      getOneItemUsingId(dbCollection, response, request.params.id);
    });

    server.post('/users', (request, response) => {
      createOneItem(dbCollection, response, request.body);
    });

    server.put('/users/:id', (request, response) => {
      updateOneItem(dbCollection, response, request.body, request.params.id);
    });

    server.delete('/users/:id', (request, response) => {
      deleteOneItem(dbCollection, response, request.params.id);
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
      getAllItems(dbCollection, response);
    });

    server.get('/groups/:id', (request, response) => {
      getOneItemUsingId(dbCollection, response, request.params.id);
    });

    server.post('/groups', (request, response) => {
      createOneItem(dbCollection, response, request.body);
    });

    server.put('/groups/:id', (request, response) => {
      updateOneItem(dbCollection, response, request.body, request.params.id);
    });

    server.delete('/groups/:id', (request, response) => {
      deleteOneItem(dbCollection, response, request.params.id);
    });

    server.get('/group/members', (request, response) => {});
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
      getAllItems(dbCollection, response);
    });

    server.get('/events/:id', (request, response) => {
      getOneItemUsingId(dbCollection, response, request.params.id);
    });

    server.post('/events', (request, response) => {
      createOneItem(dbCollection, response, request.body);
    });

    server.put('/events/:id', (request, response) => {
      updateOneItem(dbCollection, response, request.body, request.params.id);
    });

    server.delete('/events/:id', (request, response) => {
      deleteOneItem(dbCollection, response, request.params.id);
    });

    server.get('/events/group/:id', (request, response) => {
      filterUsingOneId(dbCollection, response, 'group', request.params.id);
    });
  },
  function(err) {
    throw err;
  }
);

db.initialize(
  dbName,
  'interests',
  function(dbCollection) {
    // get all events
    dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
      //   console.log(result);
    });

    server.get('/interests', (request, response) => {
      getAllItems(dbCollection, response);
    });

    server.post('/interests', (request, response) => {
      createOneItem(dbCollection, response, request.body);
    });
  },
  function(err) {
    throw err;
  }
);

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
