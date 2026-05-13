import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './router/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 5002;

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});