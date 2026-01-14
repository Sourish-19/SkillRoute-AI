import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const db = await getDb();

    try {
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) return res.status(409).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        // Auto login after register
        const token = jwt.sign({ id: result.lastID, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await getDb();

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { email: user.email } });
});

// Mock Google Auth endpoint
router.post('/google', async (req, res) => {
    // In a real app, you'd verify the Google token from the client here using google-auth-library
    // For now, we'll simulate a successful login/register if an email is provided
    const { email, name, googleToken } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    const db = await getDb();
    let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
        // Create user if not exists (assume verified by Google on client)
        const output = await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, 'GOOGLE_AUTH_PLACEHOLDER']);
        user = { id: output.lastID, email };
    }

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { email } });
});

export default router;
