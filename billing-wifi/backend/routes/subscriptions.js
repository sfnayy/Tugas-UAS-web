import express from 'express';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseClient.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const subscriptionsCollection = collection(db, 'subscriptions');

// Protect all subscription routes with verifyToken
router.use(verifyToken);

// GET /api/subscriptions/my-subscription - Get subscription for current user
router.get('/my-subscription', async (req, res) => {
  try {
    const q = query(subscriptionsCollection, where('user_id', '==', req.user.id));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return res.json({ message: 'No active subscription found' });
    }

    const subscriptions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving subscription', error: error.message });
  }
});

// Admin Only Routes Below
router.use(isAdmin);

// GET /api/subscriptions - Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const querySnapshot = await getDocs(subscriptionsCollection);
    const subscriptions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving subscriptions', error: error.message });
  }
});

// POST /api/subscriptions - Create a new subscription
router.post('/', async (req, res) => {
  try {
    const { user_id, package_id, due_date } = req.body;

    const newSubscription = {
      user_id,
      package_id,
      due_date, // e.g., '15' (for the 15th of every month) or ISO date string
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(subscriptionsCollection, newSubscription);
    res.status(201).json({ message: 'Subscription created successfully', id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
});

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', async (req, res) => {
  try {
    const { package_id, due_date, status } = req.body;
    const subDocRef = doc(db, 'subscriptions', req.params.id);
    const subDoc = await getDoc(subDocRef);

    if (!subDoc.exists()) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const updateData = {};
    if (package_id) updateData.package_id = package_id;
    if (due_date) updateData.due_date = due_date;
    if (status) updateData.status = status;
    updateData.updatedAt = new Date().toISOString();

    await updateDoc(subDocRef, updateData);
    res.json({ message: 'Subscription updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
});

// DELETE /api/subscriptions/:id - Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    const subDocRef = doc(db, 'subscriptions', req.params.id);
    const subDoc = await getDoc(subDocRef);

    if (!subDoc.exists()) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await deleteDoc(subDocRef);
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscription', error: error.message });
  }
});

export default router;
