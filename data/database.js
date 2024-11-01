const {MongoClient} = require('mongodb');
const dotEnv = require('dotenv').config();


let database;

const initDb = (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
      }
      MongoClient.connect(process.env.MONGODB_URI)
        .then((client) => {
          database = client;
          callback(null, database);
        })
        .catch((err) => {
          callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
      }
      return database;
};

const closeDb = () => {
	if (database) {
		return database.close();
	}
	return Promise.resolve(); // Return a resolved promise if no client to close
};

module.exports = {
    initDb,
    getDatabase,
    closeDb,
};