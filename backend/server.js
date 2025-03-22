import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import QuickcartModel from "./models/register.model.js";

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
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
  
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await QuickcartModel.findOne({ email });
        console.log('User found:', user);
  
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (user.password === password) {  // Reminder: Use hashing in production
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,    // Optional if available
                    email: user.email,
                    phone: user.phone,          // ✅ Send phone
                    address: user.address       // ✅ Send address
                }
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: "Server error while logging in" });
    }
});


// Test route
app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

app.listen(5000, () => {
    connectDB();
    console.log("Server is running on port 5000");
});