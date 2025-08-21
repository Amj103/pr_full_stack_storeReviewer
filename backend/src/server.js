import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import storeRoutes from './routes/stores.js';
import ratingRoutes from './routes/ratings.js';
import adminRoutes from './routes/admin.js';
import ownerRoutes from './routes/owner.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/stores', storeRoutes);
app.use('/ratings', ratingRoutes);
app.use('/admin', adminRoutes);
app.use('/owner', ownerRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
