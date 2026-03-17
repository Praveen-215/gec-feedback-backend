const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_H6mVyok0TZCU@ep-dark-cherry-aduo9c6v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require', 
  ssl: { rejectUnauthorized: false } 
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  // Simple password protection
  const auth = req.headers['authorization'];
  if (auth !== 'Bearer gec-admin-2025') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const result = await pool.query('SELECT * FROM parent_feedback ORDER BY submitted_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};