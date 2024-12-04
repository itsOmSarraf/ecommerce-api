// src/index.ts
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Base route
app.get('/', (req, res) => {
	res.json({ message: 'E-commerce API is running' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`⚡️ Server is running on port ${port}`);
});
