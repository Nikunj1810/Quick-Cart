
import { Product, Category, UploadedImage } from "@/types";
import { products as mockProducts, getProductById } from "@/data/products";

// In a real application, these would be API calls to your backend
// For now, we'll simulate them with local data

// Mock categories
let categories: Category[] = [
  { id: "1", name: "T-shirts", slug: "t-shirts" },
  { id: "2", name: "Shirts", slug: "shirts" },
  { id: "3", name: "Jeans", slug: "jeans" },
  { id: "4", name: "Dresses", slug: "dresses" },
  { id: "5", name: "Sweaters", slug: "sweaters" },
];

// Mock in-memory products store
let productsStore = [...mockProducts];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  await delay(500); // Simulate network delay
  return productsStore;
};

// Get product by ID
export const getProduct = async (id: string): Promise<Product | null> => {
  await delay(300); 
  const product = productsStore.find(p => p.id === id);
  return product || null;
};

// Toggle checked status for a product
export const toggleProductChecked = async (id: string): Promise<Product | null> => {
  await delay(200);
  const index = productsStore.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  productsStore[index] = {
    ...productsStore[index],
    checked: !productsStore[index].checked
  };
  
  return productsStore[index];
};

// Get all checked products
export const getCheckedProducts = async (): Promise<Product[]> => {
  await delay(300);
  return productsStore.filter(p => p.checked);
};

// Create product
export const createProduct = async (product: Partial<Product>, imageFile?: File): Promise<Product> => {
  await delay(800);
  
  let imageUrl = "/placeholder.svg";
  
  // In a real app, this would upload to a server or cloud storage
  if (imageFile) {
    imageUrl = URL.createObjectURL(imageFile);
    // This URL is temporary and only works in the current session
    // In a real app, you'd upload the file and get a permanent URL
  }
  
  // Process tags properly
  let tags: string[] = [];
  if (product.tags) {
    if (typeof product.tags === 'string') {
      // Type assertion to string, since we've checked it's a string
      tags = (product.tags as string).split(',').map(tag => tag.trim());
    } else if (Array.isArray(product.tags)) {
      tags = product.tags;
    }
  }
  
  const newProduct: Product = {
    id: Date.now().toString(),
    name: product.name || "Untitled Product",
    price: product.price || 0,
    originalPrice: product.originalPrice,
    description: product.description,
    category: product.category || "Uncategorized",
    imageUrl,
    colors: product.colors || [],
    sizes: product.sizes || [],
    stock: product.stock || 0,
    sku: product.sku,
    brand: product.brand,
    tags: tags,
    checked: product.checked || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  productsStore.push(newProduct);
  return newProduct;
};

// Update product
export const updateProduct = async (id: string, updates: Partial<Product>, imageFile?: File): Promise<Product> => {
  await delay(800);
  
  const index = productsStore.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Product not found");
  
  let imageUrl = productsStore[index].imageUrl;
  
  // Handle image update if provided
  if (imageFile) {
    imageUrl = URL.createObjectURL(imageFile);
  }
  
  // Process tags properly
  let tags: string[] = productsStore[index].tags || [];
  if (updates.tags) {
    if (typeof updates.tags === 'string') {
      // Type assertion to string, since we've checked it's a string
      tags = (updates.tags as string).split(',').map(tag => tag.trim());
    } else if (Array.isArray(updates.tags)) {
      tags = updates.tags;
    }
  }
  
  // Update the product with new values
  const updatedProduct: Product = {
    ...productsStore[index],
    ...updates,
    imageUrl,
    tags,
    updatedAt: new Date().toISOString(),
  };
  
  productsStore[index] = updatedProduct;
  return updatedProduct;
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  await delay(500);
  const index = productsStore.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Product not found");
  
  productsStore.splice(index, 1);
};

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  await delay(300);
  return categories;
};

// Create category
export const createCategory = async (name: string): Promise<Category> => {
  await delay(500);
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  
  const newCategory: Category = {
    id: Date.now().toString(),
    name,
    slug,
  };
  
  categories.push(newCategory);
  return newCategory;
};

// Update category
export const updateCategory = async (id: string, name: string): Promise<Category> => {
  await delay(500);
  
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) throw new Error("Category not found");
  
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  
  categories[index] = {
    ...categories[index],
    name,
    slug,
  };
  
  return categories[index];
};

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  await delay(500);
  
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) throw new Error("Category not found");
  
  categories.splice(index, 1);
};
