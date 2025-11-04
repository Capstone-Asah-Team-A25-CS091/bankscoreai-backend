import express from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();
import authRouter from './api/auth';

const app = express();
const port = process.env.PORT || 3000;


app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});