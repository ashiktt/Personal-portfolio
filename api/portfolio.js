import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function getDatabase(customUri) {
  const uri = customUri || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured in Vercel Environment Variables');
  }

  // If using default URI and already connected, reuse cached client
  if (!customUri && cachedClient && cachedDb) {
    try {
      await cachedDb.command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch {
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');

  if (!customUri) {
    cachedClient = client;
    cachedDb = db;
  }

  return { client, db };
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-mongodb-uri'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const customUri = (req.headers && req.headers['x-mongodb-uri']) || (req.query && req.query.uri);

  // 1. Status / Connection Test
  if (req.query && (req.query.action === 'status' || req.query.action === 'test')) {
    try {
      const { db } = await getDatabase(customUri);
      await db.command({ ping: 1 });
      return res.status(200).json({
        success: true,
        connected: true,
        source: customUri ? 'custom' : 'vercel',
        message: 'Connected to MongoDB Atlas successfully! Ping verified.',
      });
    } catch (err) {
      return res.status(200).json({
        success: false,
        connected: false,
        message: err.message || 'Failed to connect to MongoDB Atlas',
      });
    }
  }

  // 2. GET: Fetch Published Portfolio Data
  if (req.method === 'GET') {
    try {
      const { db } = await getDatabase(customUri);
      const collection = db.collection('portfolio_settings');
      const doc = await collection.findOne({ _id: 'portfolio_data' });

      if (!doc || !doc.site_data) {
        return res.status(200).json({
          success: true,
          data: null,
          message: 'No published data found in MongoDB yet (using initial data)',
        });
      }

      return res.status(200).json({
        success: true,
        data: doc.site_data,
        updated_at: doc.updated_at,
      });
    } catch (err) {
      console.warn('MongoDB GET warning:', err.message);
      // Return 200 with null data so client falls back gracefully to initialData
      return res.status(200).json({
        success: false,
        error: err.message,
        data: null,
      });
    }
  }

  // 3. POST: Save / Publish Updated Portfolio Data
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body) {
        return res.status(400).json({ success: false, error: 'Request body is required' });
      }

      const { db } = await getDatabase(customUri);
      const collection = db.collection('portfolio_settings');

      // Strip adminPasscode if present
      const safeData = { ...body };
      if (safeData.profile && safeData.profile.adminPasscode) {
        delete safeData.profile.adminPasscode;
      }

      await collection.updateOne(
        { _id: 'portfolio_data' },
        {
          $set: {
            site_data: safeData,
            updated_at: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Portfolio published to MongoDB Atlas successfully! Live website is updated.',
      });
    } catch (err) {
      console.error('MongoDB POST error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to save to MongoDB Atlas',
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
