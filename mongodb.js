import { MongoClient } from 'mongodb';
import assert from 'assert';

// Connection URL
const url = process.env.MONGO_TOULKORK_URL;
const option = { useNewUrlParser: true };

// Database Name
const dbName = 'toulkork-branch';

// Use connect method to connect to the server
MongoClient.connect(url, option, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
	console.log("​db", db)

  client.close();
});