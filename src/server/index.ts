import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import checkoutRoutes from './routes/checkout';
import paymentRoutes from './routes/payment';
import { BlockchainListener } from './services/blockchain-listener';

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize blockchain listener
new BlockchainListener();

app.use(cors());
app.use(express.json());

app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});