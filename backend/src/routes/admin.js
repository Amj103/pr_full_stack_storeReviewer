import { Router } from 'express';
import { pool } from '../db.js';
import { auth, allow } from '../middlewares/auth.js';
import { validationResult } from 'express-validator';
import { vCreateUser, vCreateStore } from '../utils/validators.js';
import { hash } from '../utils/hash.js';

const r = Router();

// Dashboard counts
r.get('/dashboard', auth(true), allow('ADMIN'), async (_req, res) => {
  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
  const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
  const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');
  res.json({ totalUsers, totalStores, totalRatings });
});

// Add users (normal or admin or owner)
r.post('/users', auth(true), allow('ADMIN'), vCreateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, password, role } = req.body;
  const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
  if (exists.length) return res.status(409).json({ error: 'Email already exists' });
  const hashed = await hash(password);
  const [result] = await pool.query(
    'INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)',
    [name, email, address, hashed, role]
  );
  res.status(201).json({ id: result.insertId });
});

// List stores (with rating) + filters/sort
r.get('/stores', auth(true), allow('ADMIN'), async (req, res) => {
  const search = (req.query.search || '').trim();
  const sortBy = ['name','email','address','rating'].includes(req.query.sortBy) ? req.query.sortBy : 'name';
  const order = (req.query.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const where = search ? 'WHERE s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?' : '';
  const params = search ? [`%${search}%`,`%${search}%`,`%${search}%`] : [];
  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, ROUND(AVG(r.score),2) AS rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${where}
     GROUP BY s.id
     ORDER BY ${sortBy == 'rating' ? 'rating' : 's.'+sortBy} ${order}`,
     params
  );
  res.json({ stores: rows });
});

// Create store
r.post('/stores', auth(true), allow('ADMIN'), vCreateStore, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, address, ownerId } = req.body;
  const [result] = await pool.query('INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)',
                  [name, email || null, address, ownerId || null]);
  res.status(201).json({ id: result.insertId });
});

// List users with filters
r.get('/users', auth(true), allow('ADMIN'), async (req, res) => {
  const search = (req.query.search || '').trim();
  const sortBy = ['name','email','address','role'].includes(req.query.sortBy) ? req.query.sortBy : 'name';
  const order = (req.query.order || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const where = search ? 'WHERE name LIKE ? OR email LIKE ? OR address LIKE ? OR role LIKE ?' : '';
  const params = search ? [`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`] : [];
  const [users] = await pool.query(
    `SELECT id, name, email, address, role
     FROM users
     ${where}
     ORDER BY ${sortBy} ${order}`,
     params
  );
  res.json({ users });
});

// Get user details (incl. if store owner, show rating/avg)
r.get('/users/:id', auth(true), allow('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const [[user]] = await pool.query('SELECT id,name,email,address,role FROM users WHERE id=?', [id]);
  if (!user) return res.status(404).json({ error: 'Not found' });

  let ownerRating = null;
  if (user.role === 'OWNER') {
    const [[{ avg }]] = await pool.query(
      `SELECT ROUND(AVG(r.score),2) AS avg
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id=?`, [id]
    );
    ownerRating = avg;
  }
  res.json({ user, ownerRating });
});

export default r;
