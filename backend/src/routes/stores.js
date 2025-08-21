import { Router } from 'express';
import { pool } from '../db.js';
import { auth } from '../middlewares/auth.js';
import { validationResult } from 'express-validator';
import { vStoreQuery } from '../utils/validators.js';

const r = Router();

// List all stores with search/sort + overall rating + current user's rating
r.get('/', auth(true), vStoreQuery, async (req, res) => {
  const search = (req.query.search || '').trim();
  const sortBy = ['name','email','address','rating'].includes(req.query.sortBy) ? req.query.sortBy : 'name';
  const order = (req.query.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const where = search ? 'WHERE s.name LIKE ? OR s.address LIKE ?' : '';
  const params = search ? [`%${search}%`, `%${search}%`] : [];

  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address,
            ROUND(AVG(r.score),2) AS rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${where}
     GROUP BY s.id
     ORDER BY ${sortBy == 'rating' ? 'rating' : 's.'+sortBy} ${order}`,
     params
  );

  // if logged in, attach user's rating
  if (req.user) {
    const ids = rows.map(r => r.id);
    if (ids.length) {
      const [mine] = await pool.query(
        'SELECT store_id, score FROM ratings WHERE user_id=? AND store_id IN (' + ids.map(_=>'?').join(',') + ')',
        [req.user.id, ...ids]
      )
      const myMap = new Map(mine.map(m => [m.store_id, m.score]));
      for (const row of rows) row.myRating = myMap.get(row.id) || null;
    }
  }

  res.json({ stores: rows });
});

export default r;
