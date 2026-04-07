const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const {
    roll_no, parent_name, student_name, email,
    academic_session, branch, year_of_admission,
    duration_as_member, satisfied, suggestions,
    pf_library, pf_games, pf_canteen, pf_water,
    pf_toilet, pf_class, pf_lab, pf_personality, pf_career,
    pt_attitude, pt_quality, pt_exams, pt_discipline, pp_placement
  } = req.body;

  const rollNoInt = parseInt(roll_no);
  if (!rollNoInt || roll_no.toString().length > 12) {
    return res.status(400).json({ success: false, message: 'Invalid Roll No.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM parent_feedback WHERE roll_no = $1', [rollNoInt]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Feedback already submitted for this Roll No. Only one submission is allowed per student.' });
    }

    await pool.query(
      `INSERT INTO parent_feedback
       (roll_no, parent_name, student_name, email, academic_session, branch,
        year_of_admission, duration_as_member, satisfied, suggestions,
        pf_library, pf_games, pf_canteen, pf_water, pf_toilet,
        pf_class, pf_lab, pf_personality, pf_career,
        pt_attitude, pt_quality, pt_exams, pt_discipline, pp_placement)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
               $11,$12,$13,$14,$15,$16,$17,$18,$19,
               $20,$21,$22,$23,$24)`,
      [rollNoInt, parent_name, student_name, email, academic_session, branch,
       year_of_admission, duration_as_member, satisfied, suggestions,
       pf_library, pf_games, pf_canteen, pf_water, pf_toilet,
       pf_class, pf_lab, pf_personality, pf_career,
       pt_attitude, pt_quality, pt_exams, pt_discipline, pp_placement]
    );
    res.json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};