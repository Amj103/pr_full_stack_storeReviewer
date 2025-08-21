import { Router } from 'express';
import { pool } from '../db.js';
import { auth, allow } from '../middlewares/auth.js';

const r = Router();

// Owner dashboard: list users who rated their store + average rating
r.get('/dashboard', auth(true), allow('OWNER'), async (req, res) => {
  // Find the store owned by this owner (assume one-to-one for simplicity)
  const [[store]] = await pool.query('SELECT id, name FROM stores WHERE owner_id=?', [req.user.id]);
  if (!store) return res.json({ store: null, average: null, raters: [] });

  const [[{ average }]] = await pool.query('SELECT ROUND(AVG(score),2) AS average FROM ratings WHERE store_id=?', [store.id]);

  const [raters] = await pool.query(
    `SELECT u.id, u.name, u.email, u.address, r.score
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id=?
     ORDER BY u.name ASC`, [store.id]
  );
  res.json({ store, average, raters });
});

export default r;
