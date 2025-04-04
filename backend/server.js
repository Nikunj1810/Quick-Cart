import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import QuickcartModel from "./models/register.model.js";
import AdminModel from "./models/admin.model.js";
import ProductModel from "./models/product.model.js";
import CategoryModel from "./models/category.model.js";
import { ContactModel } from "./models/contact.model.js";

// Get directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
        console.log(`Created uploads directory at: ${uploadsDir}`);
    } else {
        // Verify write permissions
        fs.accessSync(uploadsDir, fs.constants.W_OK);
    }
} catch (error) {
    console.error(`Error managing uploads directory: ${error.message}`);
    if (error.code === 'EACCES') {
        console.error('Permission denied: Unable to create or access uploads directory');
    } else if (error.code === 'ENOSPC') {
        console.error('No space left on device for creating uploads directory');
    }
    process.exit(1);
}

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg'];
        const allowedExtensions = ['.jpg', '.jpeg'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (!allowedTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
            const error = new Error('Only JPG/JPEG images are allowed!');
            error.code = 'INVALID_FILE_TYPE';
            return cb(error, false);
        }
        cb(null, true);
    }
});

// Multer error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size is too large. Max size is 5MB.' });
        }
        return res.status(400).json({ error: error.message });
    } else if (error) {
        if (error.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Something went wrong with file upload.' });
    }
    next();
});

// Connect to Database
connectDB();

/// --- PRODUCT ENDPOINTS ---
// Get all products with optional filtering, sorting, and pagination
app.get("/api/products", async (req, res) => {
    try {
        const { category, brand, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10, newArrivals } = req.query;
        
        const filter = {};
if (newArrivals) filter.isNewArrival = true;
        if (category) filter.category = category;
        if (brand) filter.brand = brand;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        const skip = (Number(page) - 1) * Number(limit);
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const total = await ProductModel.countDocuments(filter);
        const products = await ProductModel.find(filter).sort(sort).skip(skip).limit(Number(limit));
        
        res.json({ products, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products", details: error.message });
    }
});

// Create a new product
// Create a new product
app.post("/api/products", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Product image is required" });

        const productData = JSON.parse(req.body.product);

        const product = new ProductModel({
            name: productData.name,
            price: Number(productData.price),
            description: productData.description,
            category: productData.category,
            brand: productData.brand,
            sku: productData.sku,
            stockQuantity: Number(productData.stockQuantity) || 0,
            originalPrice: Number(productData.originalPrice) || productData.price,
            discountPercentage: Number(productData.discountPercentage) || 0,
            sizeType: productData.sizeType || "standard",
            sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
            imageUrl: `/uploads/${req.file.filename}`
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product", details: error.message });
    }
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product", details: error.message });
    }
});

// Update product
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
            if (product.imageUrl) {
                const oldImagePath = path.join(__dirname, product.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Ensure sizeType and sizes are handled
        product.sizeType = updates.sizeType || product.sizeType;
        product.sizes = Array.isArray(updates.sizes) ? updates.sizes : product.sizes;

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
        
        if (product.imageUrl) fs.unlinkSync(path.join(__dirname, product.imageUrl));
        await product.deleteOne();
        
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product", details: error.message });
    }
});


// --- CONTACT US FORM SUBMISSION ---
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const contact = new ContactModel({ name, email, subject, message });
        await contact.save();
        res.status(201).json({ message: "Your message has been received" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit message", details: error.message });
    }
});

// --- USER REGISTRATION ---
app.post("/api/register", async (req, res) => {
    try {
        const { firstName, lastName, phone, address, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });
        const existingUser = await QuickcartModel.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });
        const user = await QuickcartModel.create({ firstName, lastName, phone, address, email, password });
        res.status(201).json({ message: "Registration successful", user });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Failed to register user", details: err.message });
    }
});

// --- LOGIN ---
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await QuickcartModel.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        res.json({ message: "Login successful", user });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Failed to login", details: err.message });
    }
});
//admin.login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email, password });
        if (!admin) return res.status(401).json({ error: 'Invalid admin credentials' });
        res.json({ message: 'Admin login successful', admin: { id: admin._id, email: admin.email }, token: 'admin_token' });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// --- CATEGORY MANAGEMENT ---
app.post("/api/categories", async (req, res) => {
    try {
        let { name } = req.body;
        if (!name) return res.status(400).json({ error: "Category name is required" });
        name = name.trim().toLowerCase();
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) return res.status(400).json({ error: "Category already exists" });
        const category = await CategoryModel.create({ name });
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Failed to create category", details: error.message });
    }
});

app.get("/api/categories", async (req, res) => {
    try {
        const categories = await CategoryModel.find({ isActive: true });
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories", details: error.message });
    }
});

// --- IMAGE UPLOAD ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

app.delete("/api/categories/:id", async (req, res) => {
    try {
        // Check if any products reference this category
        const productsWithCategory = await ProductModel.findOne({ category: req.params.id });
        if (productsWithCategory) {
            return res.status(400).json({ 
                error: "Cannot delete category - it is being used by one or more products" 
            });
        }
        
        const category = await CategoryModel.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category", details: error.message });
    }
});

app.put("/api/categories/:id", async (req, res) => {
    try {
        let { name } = req.body;
        if (!name) return res.status(400).json({ error: "Category name is required" });
        
        name = name.trim().toLowerCase();
        const category = await CategoryModel.findById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        
        const existingCategory = await CategoryModel.findOne({ name, _id: { $ne: req.params.id } });
        if (existingCategory) return res.status(400).json({ error: "Category name already exists" });
        
        category.name = name;
        await category.save();
        
        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category", details: error.message });
    }
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const contact = new ContactModel({ name, email, subject, message });
        await contact.save();
        res.status(201).json({ message: "Contact form submitted successfully" });
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

// --- GLOBAL ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});