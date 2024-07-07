import express from 'express';
import authMiddleware from './middleware/auth.js';
import journalRouter from './routes/journalRoutes.js';
import summaryRouter from './routes/summaryRoutes.js';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send('Core Gateway is up and running!');
});

// Routes
app.use('/auth', authRouter);
app.use('/journals',authMiddleware,journalRouter);
app.use('/summaries', authMiddleware,summaryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});