import express from "express";
import cors from "cors";
import "dotenv/config";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable JSON body parser
app.use(express.json());

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import packagesRouter from './routes/packages.js';
import subscriptionsRouter from './routes/subscriptions.js';
import invoicesRouter from './routes/invoices.js';
import paymentsRouter from './routes/payments.js';

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "wifi billing API is running"
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/payments', paymentsRouter);

// Start the server (only locally, Vercel ignores this when exported)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function
export default app;
