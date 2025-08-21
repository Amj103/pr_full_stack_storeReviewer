import { Router } from 'express';
import { pool } from '../db.js';
import { auth, allow } from '../middlewares/auth.js';
import { vRating } from '../utils/validators.js';
import { validationResult } from 'express-validator';

const r = Router();

r.post('/', auth(true), async (req, res, next) => {
  if (req.user.role !== 'USER') return res.status(403).json({ error: 'Only normal users can rate' });
  next();
}, vRating, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { storeId, score } = req.body;

  await pool.query(
    `INSERT INTO ratings (user_id, store_id, score)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE score=VALUES(score), updated_at=NOW()`,
    [req.user.id, storeId, score]
  );
  res.status(201).json({ ok: true });
});

export default r;
