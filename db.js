const { MongoClient } = require('mongodb');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const dbConnectionUrl = process.env.DB_CONNECTION_URL;

function initialize(
  dbName,
  dbCollectionName,
  successCallback,
  failureCallback
) {
  MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
    if (err) {
      console.log(`[MongoDB connection] ERROR: ${err}`);
      failureCallback(err); // this should be "caught" by the calling function
    } else {
      const dbObject = dbInstance.db(dbName);
      const dbCollection = dbObject.collection(dbCollectionName);
      console.log('[MongoDB connection] SUCCESS', dbCollectionName);

      successCallback(dbCollection);
    }
  });
}

module.exports = {
  initialize,
};
