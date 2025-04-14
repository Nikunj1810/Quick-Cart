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
        res.status(500).json({ error: "Failed to submit contact form", details: error.message });
    }
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product", details: error.message });
    }
});

// Toggle checked status for a product
app.put("/api/products/:id/toggle", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        product.checked = !product.checked;
        await product.save();
        res.json(product);
    } catch (error) {
        console.error("Error toggling product status:", error);
        res.status(500).json({ error: "Failed to toggle product status", details: error.message });
    }
});

// Get all checked products
app.get("/api/products/checked", async (req, res) => {
    try {
        const products = await ProductModel.find({ checked: true });
        res.json(products);
    } catch (error) {
        console.error("Error fetching checked products:", error);
        res.status(500).json({ error: "Failed to fetch checked products", details: error.message });
    }
});

// Update product
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
    try {
        if (!req.body.updates) {
            return res.status(400).json({ error: "Updates data is required" });
        }
        let updates;
        try {
            updates = JSON.parse(req.body.updates);
        } catch (error) {
            return res.status(400).json({ error: "Invalid updates format", details: error.message });
        }
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        if (req.file) {
            updates.imageUrl = `/uploads/${req.file.filename}`;
            // Delete old image if it exists
            if (product.imageUrl) {
                const oldImagePath = path.join(__dirname, product.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        Object.assign(product, updates);
        await product.save();
        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product", details: error.message });
    }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        // Delete associated image if it exists
        if (product.imageUrl) {
            const imagePath = path.join(__dirname, product.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product", details: error.message });
    }
});

// --- CART ENDPOINTS ---
// Get cart for a user
app.get("/api/cart/:userId", async (req, res) => {
    try {
        const cart = await CartModel.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart", details: error.message });
    }
});

// Initialize or update cart
app.post("/api/cart/:userId", async (req, res) => {
    try {
        const { items } = req.body;
        const cart = await CartModel.findOneAndUpdate(
            { userId: req.params.userId },
            { items, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to update cart", details: error.message });
    }
});

// Add item to cart
app.post("/api/cart/:userId/items", async (req, res) => {
    try {
        const { productId, size, sizeType, quantity } = req.body;
        if (!productId || !size || !sizeType || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let cart = await CartModel.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new CartModel({ userId: req.params.userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.productId === productId && item.size === size && item.sizeType === sizeType
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, size, sizeType, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart", details: error.message });
    }
});

// Update item quantity in cart
app.put("/api/cart/:userId/items/:productId", async (req, res) => {
    try {
        const { quantity, size, sizeType } = req.body;
        if (!quantity || quantity < 0) {
            return res.status(400).json({ error: "Invalid quantity" });
        }

        const cart = await CartModel.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            item => item.productId === req.params.productId && item.size === size && item.sizeType === sizeType
        );

        if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to update item quantity", details: error.message });
    }
});

// Remove item from cart
app.delete("/api/cart/:userId/items/:productId", async (req, res) => {
    try {
        const { size, sizeType } = req.body;
        const cart = await CartModel.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            item => item.productId === req.params.productId && item.size === size && item.sizeType === sizeType
        );

        if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

        cart.items.splice(itemIndex, 1);
        cart.updatedAt = Date.now();
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item from cart", details: error.message });
    }
});

// Clear cart
app.delete("/api/cart/:userId", async (req, res) => {
    try {
        const cart = await CartModel.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = [];
        cart.updatedAt = Date.now();
        await cart.save();
        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart", details: error.message });
    }
});

// --- ORDER ENDPOINTS ---
// Create a new order
app.post("/api/orders", async (req, res) => {
    try {
        const { userId, items, shippingInfo, paymentMethod, subtotal, deliveryFee, orderTotal } = req.body;
        
        if (!userId || !items || !shippingInfo || !paymentMethod || !subtotal || !deliveryFee || !orderTotal) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        // Create order with complete product details
        const orderItems = await Promise.all(items.map(async (item) => {
            try {
                const product = await ProductModel.findById(item.productId);
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }
                
                return {
                    productId: item.productId,
                    name: product.name,
                    price: product.price,
                    size: item.size,
                    sizeType: item.sizeType,
                    quantity: item.quantity,
                    imageUrl: product.imageUrl
                };
            } catch (err) {
                console.error(`Error processing order item: ${err.message}`);
                throw err;
            }
        }));
        
        const order = new OrderModel({
            userId,
            items: orderItems,
            shippingInfo,
            paymentMethod,
            subtotal,
            deliveryFee,
            orderTotal,
            orderDate: new Date(),
            status: 'pending'
        });
        
        await order.save();
        
        // Clear the user's cart after successful order
        await CartModel.findOneAndUpdate(
            { userId },
            { items: [], updatedAt: new Date() }
        );
        
        res.status(201).json({ 
            message: "Order created successfully", 
            order,
            orderId: order._id 
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order", details: error.message });
    }
});

// Get all orders for a user
app.get("/api/orders/user/:userId", async (req, res) => {
    try {
        const orders = await OrderModel.find({ userId: req.params.userId }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: "Failed to fetch orders", details: error.message });
    }
});

// Get a specific order by ID
app.get("/api/orders/:id", async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: "Failed to fetch order", details: error.message });
    }
});

// Update order status (admin only)
app.put("/api/orders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }
        
        // Validate status value
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }
        
        const order = await OrderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        order.status = status;
        await order.save();
        
        res.json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Failed to update order status", details: error.message });
    }
});

// Get all orders (admin only)
app.get("/api/orders", async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        const filter = {};
        if (status) filter.status = status;
        
        const skip = (Number(page) - 1) * Number(limit);
        const total = await OrderModel.countDocuments(filter);
        
        const orders = await OrderModel.find(filter)
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(Number(limit));
        
        res.json({ 
            orders, 
            pagination: { 
                total, 
                page: Number(page), 
                pages: Math.ceil(total / Number(limit)) 
            } 
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ error: "Failed to fetch orders", details: error.message });
    }
});

// Delete an order (admin only)
app.delete("/api/orders/:id", async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        await order.deleteOne();
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Failed to delete order", details: error.message });
    }
});

// --- GLOBAL ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    createDefaultAdmin();
});