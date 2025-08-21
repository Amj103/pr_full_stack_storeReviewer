import { Router } from 'express';
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { vSignup, vLogin } from '../utils/validators.js';
import { hash, compare } from '../utils/hash.js';

const r = Router();

function token(user) {
  return jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Normal user signup
r.post('/signup', vSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, password } = req.body;
  const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
  if (rows.length) return res.status(409).json({ error: 'Email already in use' });
  const hashed = await hash(password);
  const [result] = await pool.query(
    'INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)',
    [name, email, address, hashed, 'USER']
  );
  const [inserted] = await pool.query('SELECT id,name,email,role FROM users WHERE id=?', [result.insertId]);
  res.status(201).json({ user: inserted[0], token: token(inserted[0]) });
});

r.post('/login', vLogin, async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const ok = await compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: token(user) });
});

export default r;
