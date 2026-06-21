import express from 'express';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseClient.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const packagesCollection = collection(db, 'packages');

// GET /api/packages - Get all packages (Public)
router.get('/', async (req, res) => {
  try {
    const querySnapshot = await getDocs(packagesCollection);
    const packages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving packages', error: error.message });
  }
});

// GET /api/packages/:id - Get a specific package (Public)
router.get('/:id', async (req, res) => {
  try {
    const packageDocRef = doc(db, 'packages', req.params.id);
    const packageDoc = await getDoc(packageDocRef);

    if (!packageDoc.exists()) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json({ id: packageDoc.id, ...packageDoc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving package', error: error.message });
  }
});

// POST /api/packages - Create a new package (Admin Only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, speed, price, description } = req.body;

    const newPackage = {
      name,
      speed,
      price,
      description,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(packagesCollection, newPackage);
    res.status(201).json({ message: 'Package created successfully', id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating package', error: error.message });
  }
});

// PUT /api/packages/:id - Update package data (Admin Only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, speed, price, description } = req.body;
    const packageDocRef = doc(db, 'packages', req.params.id);
    const packageDoc = await getDoc(packageDocRef);

    if (!packageDoc.exists()) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (speed) updateData.speed = speed;
    if (price) updateData.price = price;
    if (description) updateData.description = description;
    updateData.updatedAt = new Date().toISOString();

    await updateDoc(packageDocRef, updateData);
    res.json({ message: 'Package updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating package', error: error.message });
  }
});

// DELETE /api/packages/:id - Delete a package (Admin Only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const packageDocRef = doc(db, 'packages', req.params.id);
    const packageDoc = await getDoc(packageDocRef);

    if (!packageDoc.exists()) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await deleteDoc(packageDocRef);
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error: error.message });
  }
});

export default router;
