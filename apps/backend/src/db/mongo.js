const { MongoClient } = require("mongodb");
const env = require("../config/env");

let client = null;

async function getMongoClient() {
  if (client) {
    return client;
  }

  client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  console.log("Connected to MongoDB");
  return client;
}

async function getGameSessionsCollection() {
  const mongo = await getMongoClient();
  const db = mongo.db("ilmquest");
  const collection = db.collection("GameSessions");

  // Create index for rate limiting queries (runs once, idempotent)
  await collection.createIndex(
    { walletAddress: 1, levelId: 1, createdAt: -1 }
  );

  return collection;
}

module.exports = {
  getMongoClient,
  getGameSessionsCollection,
};

