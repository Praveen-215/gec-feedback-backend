// api/alumni-feedback.js
// Place this file inside your backend project at: /api/alumni-feedback.js

const { neon } = require('@neondatabase/serverless');

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const sql = neon(process.env.DATABASE_URL);
    const d = req.body;

    await sql`
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
        ${d.full_name}, ${parseInt(d.passing_year)}, ${d.branch}, ${d.mobile}, ${d.email},
        ${d.organisation}, ${d.designation}, ${d.present_location}, ${d.permanent_address},

        ${parseInt(d.ar_admission)}, ${parseInt(d.ar_fee)}, ${parseInt(d.ar_scholarship)}, ${parseInt(d.ar_gender)},
        ${parseInt(d.ar_material)}, ${parseInt(d.ar_env)}, ${parseInt(d.ar_infra)}, ${parseInt(d.ar_faculty)}, ${parseInt(d.ar_project)},
        ${parseInt(d.ar_qsm)}, ${parseInt(d.ar_tp)}, ${parseInt(d.ar_library)}, ${parseInt(d.ar_canteen)}, ${parseInt(d.ar_hostel)},
        ${parseInt(d.ar_alumni_assoc)}, ${parseInt(d.ar_caliber)}, ${parseInt(d.ar_relevance)}, ${parseInt(d.ar_overall)},

        ${d.al_proud}, ${d.al_contribute},
        ${d.al_grievance_student}, ${d.al_grievance_alumni},

        ${d.aq_lab}, ${d.aq_lib}, ${d.aq_comp}, ${d.aq_wifi}, ${d.aq_sports}, ${d.aq_class},

        ${d.df_knowledge}, ${d.df_useful}, ${d.df_cooperative},

        ${d.ai_projects}, ${d.ai_seminars}, ${d.ai_guest}, ${d.ai_training},

        ${d.suggestions || ''}
      )
    `;

    return res.status(200).json({ success: true, message: 'Alumni feedback saved successfully' });

  } catch (err) {
    console.error('Alumni feedback error:', err);
    return res.status(500).json({ error: 'Failed to save feedback. Please try again.' });
  }
}
