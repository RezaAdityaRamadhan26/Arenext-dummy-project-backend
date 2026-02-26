import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import venueRoutes from './src/routes/venueRoutes.js';
import authRoutes from './src/routes/authRoutes.js' 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/venues", venueRoutes);
app.use("/api/auth", authRoutes)

app.get('/', (req, res) => {
  res.send('berhasil!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});