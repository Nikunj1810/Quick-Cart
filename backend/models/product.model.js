import mongoose from "mongoose";

// Counter Schema to track the last used ID
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true },
});
const Counter = mongoose.model("Counter", counterSchema);

// Product Schema with custom auto-incremented _id
const productSchema = new mongoose.Schema({
  _id: { type: String }, // Custom Product ID, auto-generated
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  stockQuantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { 
    type: Number, 
    required: true, 
    min: 0,
    validate: {
      validator: function (value) {
        return value >= this.price;
      },
      message: "Original price must be greater than or equal to the current price",
    },
  },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, required: true },
});

// Middleware to generate auto-incremented custom product ID
productSchema.pre("save", async function (next) {
  if (!this._id) { // Only generate _id if it's not provided
    const counter = await Counter.findByIdAndUpdate(
      { _id: "productId" },
      { $inc: { seq: 1 } }, // Increment the counter
      { new: true, upsert: true } // Create counter if not exists
    );

    this._id = `PROD-${counter.seq.toString().padStart(4, "0")}`; // Format as PROD-1001
  }
  next();
});

export const CounterModel = Counter;

export default mongoose.model("Product", productSchema);
