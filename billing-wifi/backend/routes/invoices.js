import express from 'express';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseClient.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const invoicesCollection = collection(db, 'invoices');

router.use(verifyToken);

// GET /api/invoices/my-invoices - Get invoices for the current user
router.get('/my-invoices', async (req, res) => {
  try {
    const q = query(invoicesCollection, where('user_id', '==', req.user.id));
    const querySnapshot = await getDocs(q);
    
    const invoices = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving invoices', error: error.message });
  }
});

// Admin Only Routes Below
router.use(isAdmin);

// GET /api/invoices - Get all invoices
router.get('/', async (req, res) => {
  try {
    const querySnapshot = await getDocs(invoicesCollection);
    const invoices = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving invoices', error: error.message });
  }
});

// POST /api/invoices/generate - Manually generate an invoice (trigger)
router.post('/generate', async (req, res) => {
  try {
    const { user_id, subscription_id, gross_amount, due_date } = req.body;

    const newInvoice = {
      user_id,
      subscription_id,
      gross_amount: Number(gross_amount),
      status: 'pending', // pending, success, failed
      due_date,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(invoicesCollection, newInvoice);
    res.status(201).json({ message: 'Invoice generated successfully', id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: 'Error generating invoice', error: error.message });
  }
});

export default router;
