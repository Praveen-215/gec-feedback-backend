// api/get-alumni-feedback.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = (req.headers['authorization'] || '').replace('Bearer ', '');
  if (token !== 'gec-admin-2025') return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query('SELECT * FROM alumni_feedback ORDER BY submitted_at DESC');
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get alumni feedback error:', err);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
};
