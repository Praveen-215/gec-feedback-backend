// api/alumni-feedback.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const d = req.body;

    await pool.query(`
      INSERT INTO alumni_feedback (
        full_name, passing_year, branch, mobile, email,
        organisation, designation, present_location, permanent_address,

        ar_admission, ar_fee, ar_scholarship, ar_gender,
        ar_material, ar_env, ar_infra, ar_faculty, ar_project,
        ar_qsm, ar_tp, ar_library, ar_canteen, ar_hostel,
        ar_alumni_assoc, ar_caliber, ar_relevance, ar_overall,

        al_proud, al_contribute,
        al_grievance_student, al_grievance_alumni,

        aq_lab, aq_lib, aq_comp, aq_wifi, aq_sports, aq_class,

        df_knowledge, df_useful, df_cooperative,

        ai_projects, ai_seminars, ai_guest, ai_training,

        suggestions
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,

        $10, $11, $12, $13,
        $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23,
        $24, $25, $26, $27,

        $28, $29,
        $30, $31,

        $32, $33, $34, $35, $36, $37,

        $38, $39, $40,

        $41, $42, $43, $44,

        $45
      )
    `, [
      d.full_name, parseInt(d.passing_year), d.branch, d.mobile, d.email,
      d.organisation, d.designation, d.present_location, d.permanent_address,

      parseInt(d.ar_admission), parseInt(d.ar_fee), parseInt(d.ar_scholarship), parseInt(d.ar_gender),
      parseInt(d.ar_material), parseInt(d.ar_env), parseInt(d.ar_infra), parseInt(d.ar_faculty), parseInt(d.ar_project),
      parseInt(d.ar_qsm), parseInt(d.ar_tp), parseInt(d.ar_library), parseInt(d.ar_canteen), parseInt(d.ar_hostel),
      parseInt(d.ar_alumni_assoc), parseInt(d.ar_caliber), parseInt(d.ar_relevance), parseInt(d.ar_overall),

      d.al_proud, d.al_contribute,
      d.al_grievance_student, d.al_grievance_alumni,

      d.aq_lab, d.aq_lib, d.aq_comp, d.aq_wifi, d.aq_sports, d.aq_class,

      d.df_knowledge, d.df_useful, d.df_cooperative,

      d.ai_projects, d.ai_seminars, d.ai_guest, d.ai_training,

      d.suggestions || ''
    ]);

    return res.status(200).json({ success: true, message: 'Alumni feedback saved successfully' });

  } catch (err) {
    console.error('Alumni feedback error:', err);
    return res.status(500).json({ error: 'Failed to save feedback. Please try again.' });
  }
};
