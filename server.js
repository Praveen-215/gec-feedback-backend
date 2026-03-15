const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get('/', (req, res) => {
  res.json({ message: 'GEC Feedback Server is running!' });
});

app.post('/api/parent-feedback', async (req, res) => {
  const {
    roll_no, parent_name, student_name, email,
    academic_session, branch, year_of_admission,
    duration_as_member, satisfied, suggestions,
    pf_library, pf_games, pf_canteen, pf_water,
    pf_toilet, pf_class, pf_lab, pf_personality, pf_career,
    pt_attitude, pt_quality, pt_exams, pt_discipline, pp_placement
  } = req.body;

  // Validate roll_no
  const rollNoInt = parseInt(roll_no);
  if (!rollNoInt || roll_no.toString().length > 12) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Roll No. Must be a number with maximum 12 digits.'
    });
  }

  try {
    // Check for duplicate roll number
    const existing = await pool.query(
      'SELECT id FROM parent_feedback WHERE roll_no = $1',
      [rollNoInt]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this Roll No. Only one submission is allowed per student.'
      });
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
});

app.post('/api/employer-feedback', async (req, res) => {
  const {
    organisation_name, industry_type, address,
    contact_person, designation, mobile, email, suggestions,
    po_knowledge, po_analysis, po_design, po_invest,
    po_tools, po_society, po_sustain, po_ethics,
    po_team, po_comm, po_mgmt, po_learn
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO employer_feedback
       (organisation_name, industry_type, address, contact_person,
        designation, mobile, email, suggestions,
        po_knowledge, po_analysis, po_design, po_invest,
        po_tools, po_society, po_sustain, po_ethics,
        po_team, po_comm, po_mgmt, po_learn)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
               $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
      [organisation_name, industry_type, address, contact_person,
       designation, mobile, email, suggestions,
       po_knowledge, po_analysis, po_design, po_invest,
       po_tools, po_society, po_sustain, po_ethics,
       po_team, po_comm, po_mgmt, po_learn]
    );
    res.json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});