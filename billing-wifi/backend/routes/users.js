import express from 'express';
import bcrypt from 'bcryptjs';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc, addDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseClient.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
const usersCollection = collection(db, 'users');

// Protect all user routes with verifyToken middleware
router.use(verifyToken);

// GET /api/users - Get all users (Admin Only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Remove passwords from response
    users.forEach(user => delete user.password);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
});

// GET /api/users/:id - Get a specific user (Admin or Owner)
router.get('/:id', async (req, res) => {
  try {
    // Only admin or the user themselves can access this details
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied, unauthorized' });
    }

    const userDocRef = doc(db, 'users', req.params.id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    delete userData.password; // Don't expose password

    res.json({ id: userDoc.id, ...userData });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
});

// POST /api/users - Create a user directly from admin (Admin Only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(usersCollection, newUser);
    res.status(201).json({ message: 'User created successfully', id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// PUT /api/users/:id - Update user data (Admin or Owner)
router.put('/:id', async (req, res) => {
  try {
    // Only admin or the user themselves can update their profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied, unauthorized' });
    }

    const { name, email, role, password } = req.body;
    const userDocRef = doc(db, 'users', req.params.id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Only admin can change the role
    if (role && req.user.role === 'admin') {
      updateData.role = role;
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    updateData.updatedAt = new Date().toISOString();

    await updateDoc(userDocRef, updateData);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// DELETE /api/users/:id - Delete a user (Admin Only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const userDocRef = doc(db, 'users', req.params.id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    await deleteDoc(userDocRef);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

export default router;
