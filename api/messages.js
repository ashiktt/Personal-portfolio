import { MongoClient, ObjectId } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Fetch messages
  if (req.method === 'GET') {
    try {
      const { db } = await getDatabase();
      const messages = await db
        .collection('contact_messages')
        .find({})
        .sort({ created_at: -1 })
        .limit(100)
        .toArray();
      return res.status(200).json({ success: true, messages });
    } catch (err) {
      return res.status(200).json({ success: false, messages: [], error: err.message });
    }
  }

  // POST: Insert message
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, email, subject, message } = body;
      const { db } = await getDatabase();
      const newMessage = {
        name,
        email,
        subject,
        message,
        read: false,
        created_at: new Date().toISOString(),
      };
      await db.collection('contact_messages').insertOne(newMessage);
      return res.status(200).json({ success: true, message: 'Message sent!' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Delete message
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const { db } = await getDatabase();
      if (id) {
        await db.collection('contact_messages').deleteOne({ _id: new ObjectId(id) });
      } else {
        await db.collection('contact_messages').deleteMany({});
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
