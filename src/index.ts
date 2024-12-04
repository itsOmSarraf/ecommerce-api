// src/index.ts
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Base route
app.get('/', (req, res) => {
	res.json({ message: 'E-commerce API is running' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`⚡️ Server is running on port ${port}`);
});
