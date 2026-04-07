const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const {
    organisation_name, industry_type, address,
    contact_person, designation, mobile, email, suggestions,
    po_knowledge, po_analysis, po_design, po_invest,
    po_tools, po_society, po_sustain, po_ethics,
    po_team, po_comm, po_mgmt, po_learn,
    support_academic, train_students, recruit_graduates,
    visit_college, skills_gap, teaching_improvements, other_suggestions
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO employer_feedback
       (organisation_name, industry_type, address, contact_person,
        designation, mobile, email, suggestions,
        po_knowledge, po_analysis, po_design, po_invest,
        po_tools, po_society, po_sustain, po_ethics,
        po_team, po_comm, po_mgmt, po_learn,
        support_academic, train_students, recruit_graduates,
        visit_college, skills_gap, teaching_improvements, other_suggestions)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
               $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
               $21,$22,$23,$24,$25,$26,$27)`,
      [organisation_name, industry_type, address, contact_person,
       designation, mobile, email, suggestions,
       po_knowledge, po_analysis, po_design, po_invest,
       po_tools, po_society, po_sustain, po_ethics,
       po_team, po_comm, po_mgmt, po_learn,
       support_academic, train_students, recruit_graduates,
       visit_college, skills_gap, teaching_improvements, other_suggestions]
    );
    res.json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};