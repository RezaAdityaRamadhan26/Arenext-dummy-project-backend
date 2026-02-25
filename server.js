import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('berhasil!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});