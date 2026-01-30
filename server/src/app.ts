import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/candidateRoutes';
import instructorRoutes from './routes/instructorRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/instructors', instructorRoutes);

export default app;
