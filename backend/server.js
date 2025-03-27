import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import QuickcartModel from "./models/register.model.js";
import AdminModel from "./models/admin.model.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Registration API
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, phone, address, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await QuickcartModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const user = await QuickcartModel.create({
            firstName,
            lastName,
            phone,
            address,
            email,
            password
        });

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login API
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await QuickcartModel.findOne({ email, password });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email
            },
            token: 'user_token'
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Admin Login API
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email, password });
        
        if (!admin) {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        res.json({
            message: 'Admin login successful',
            admin: {
                id: admin._id,
                email: admin.email
            },
            token: 'admin_token'
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

const PORT = process.env.PORT || 5000;
// Create default admin user
const createDefaultAdmin = async () => {
    try {
        const defaultAdmin = {
            email: 'admin@quickcart.com',
            password: 'admin123'
        };

        const existingAdmin = await AdminModel.findOne({ email: defaultAdmin.email });
        if (!existingAdmin) {
            await AdminModel.create(defaultAdmin);
            console.log('Default admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    createDefaultAdmin();
});