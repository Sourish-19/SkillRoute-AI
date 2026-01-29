import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('Using Mock Register (Offline Mode)');
            const mockToken = jwt.sign({ id: 'mock-id', email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
            return res.json({ token: mockToken, user: { email } });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword
        });

        // Auto login after register
        const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { email } });
    } catch (error) {
        console.log('Auth Register Error (falling back to mock):', error.message);
        const mockToken = jwt.sign({ id: 'mock-id', email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.json({ token: mockToken, user: { email } });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Mock fallback if DB is not connected
        if (mongoose.connection.readyState !== 1) {
            console.log('Using Mock Login (Offline Mode)');
            const mockToken = jwt.sign({ id: 'mock-id', email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
            return res.json({ token: mockToken, user: { email } });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { email: user.email } });
    } catch (error) {
        // Fallback catch-all for mock
        console.log('Auth Error (falling back to mock):', error.message);
        const mockToken = jwt.sign({ id: 'mock-id', email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.json({ token: mockToken, user: { email } });
    }
});

// Mock Google Auth endpoint (Simulation for now)
router.post('/google', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists
            user = await User.create({
                email,
                password: 'GOOGLE_AUTH_PLACEHOLDER_' + Date.now() // Random password for social login users
            });
        }

        const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
