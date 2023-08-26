import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
let cachedDb = null;

export async function connectToDatabase() {
    if (cachedDb) {
        console.log("Using cached database connection");
        return { client: cachedDb.client, db: cachedDb.db };
    }

    console.log("Setting up new database connection");
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('testDatabase');

    console.log("Database selected:", db.s.databaseName);

    cachedDb = { client, db };

    return { client, db };
}
