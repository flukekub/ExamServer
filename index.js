import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';


connectDB();  // เรียกใช้การเชื่อมต่อกับ MongoDB

//routes files
import examRoutes from './routes/exams.js';
import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/scores.js';
import subjectRoutes from './routes/subject.js';


const app = express();
app.use(cors());
app.use(express.json());

//Mount routers
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/scores', scoreRoutes);
app.use('/api/v1/subjects', subjectRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} on ${process.env.HOST}:${process.env.PORT}`);
});
