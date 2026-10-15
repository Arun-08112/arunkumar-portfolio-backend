import { pool } from '../config/db.js';

const queries = {
  profile: 'SELECT * FROM profile ORDER BY id LIMIT 1',
  skills: 'SELECT * FROM skills ORDER BY category, display_order, id',
  projects: `SELECT p.*, COALESCE((SELECT json_agg(pt.technology_name ORDER BY pt.technology_name) FROM project_technologies pt WHERE pt.project_id = p.id), '[]'::json) AS technologies FROM projects p ORDER BY p.display_order, p.id`,
  experiences: 'SELECT * FROM experiences ORDER BY display_order, start_date DESC, id',
  education: 'SELECT * FROM education ORDER BY display_order, end_year DESC NULLS LAST, id',
  socialLinks: 'SELECT * FROM social_links ORDER BY display_order, id',
};

export function getPortfolioSection(section) {
  return async (req, res, next) => {
    try {
      const result = await pool.query(queries[section]);
      res.json({ success: true, data: section === 'profile' ? (result.rows[0] ?? null) : result.rows });
    } catch (error) {
      next(error);
    }
  };
}

export async function getHealth(req, res, next) {
  try {
    const result = await pool.query('SELECT 1 AS ok');
    res.json({ success: true, api: 'running', database: result.rows[0].ok === 1 ? 'connected' : 'unknown' });
  } catch (error) {
    next(error);
  }
}
