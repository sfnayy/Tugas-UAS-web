import express from 'express';
import midtransClient from 'midtrans-client';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseClient.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Initialize Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// POST /api/payments/charge - Generate Snap Token for a specific invoice
router.post('/charge', verifyToken, async (req, res) => {
  try {
    const { invoice_id, gross_amount, customer_details } = req.body;

    const parameter = {
      transaction_details: {
        order_id: `INV-${invoice_id}-${Date.now()}`, // Ensure unique order_id for Midtrans
        gross_amount: Number(gross_amount)
      },
      customer_details: customer_details || {
        first_name: req.user.name || 'Customer'
      },
      // We pass the invoice ID as custom field so we can map it back in webhook
      custom_field1: invoice_id 
    };

    const transaction = await snap.createTransaction(parameter);
    
    res.json({ token: transaction.token, redirect_url: transaction.redirect_url });
  } catch (error) {
    console.error('Midtrans Charge Error:', error);
    res.status(500).json({ message: 'Error generating payment token', error: error.message });
  }
});

// POST /api/payments/webhook - Handle Midtrans notifications (Public Endpoint)
router.post('/webhook', async (req, res) => {
  try {
    const statusResponse = await snap.transaction.notification(req.body);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const invoiceId = statusResponse.custom_field1;

    if (!invoiceId) {
      return res.status(400).json({ message: 'Missing custom_field1 (invoice_id)' });
    }

    const invoiceRef = doc(db, 'invoices', invoiceId);

    let paymentStatus = 'pending';

    // Midtrans Transaction Status Logic
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        paymentStatus = 'pending';
      } else if (fraudStatus === 'accept') {
        paymentStatus = 'success';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'success';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      paymentStatus = 'failed';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
    }

    // Update Firestore Invoice Status
    await updateDoc(invoiceRef, {
      status: paymentStatus,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Webhook received and processed' });
  } catch (error) {
    console.error('Midtrans Webhook Error:', error);
    res.status(500).json({ message: 'Error processing webhook', error: error.message });
  }
});

export default router;
