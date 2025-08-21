import { Router } from 'express';
import { pool } from '../db.js';
import { validationResult } from 'express-validator';
import { auth, allow } from '../middlewares/auth.js';
import { vPasswordUpdate } from '../utils/validators.js';
import { compare, hash } from '../utils/hash.js';

const r = Router();

// Update own password (all roles)
r.post('/me/password', auth(true), vPasswordUpdate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { oldPassword, newPassword } = req.body;
  const [rows] = await pool.query('SELECT id,password_hash FROM users WHERE id=?', [req.user.id]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  const ok = await compare(oldPassword, rows[0].password_hash);
  if (!ok) return res.status(400).json({ error: 'Old password incorrect' });
  const newHash = await hash(newPassword);
  await pool.query('UPDATE users SET password_hash=? WHERE id=?', [newHash, req.user.id]);
  res.json({ ok: true });
});

export default r;
