import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  brand: z.string().min(2, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  stockQuantity: z.coerce.number().min(0, "Stock cannot be negative").optional(),
  price: z.coerce.number().min(1, "Price is required"),
  originalPrice: z.coerce.number().min(0, "Original price cannot be negative").optional(),
  sku: z.string().min(2, "SKU is required"),
  discountPercentage: z.coerce.number().min(0).max(100, "Discount must be between 0-100").optional(),
  imageUrl: z.string().optional(), // Include imageUrl for existing images
});

const AddProductForm = ({ product = null, onSubmit = () => {} }) => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema), defaultValues: product || {} });

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(response => setCategories(response.data))
      .catch(() => toast({ title: "Error", description: "Failed to load categories", variant: "destructive", className: "bg-white border-red-500 text-red-500" }));
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("image", { message: "Product image is required" });
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setError("image", { message: "Invalid file type. Upload JPEG, PNG, or GIF" });
      setImage(null);
      setImagePreview(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("image", { message: "Image size exceeds 5MB" });
      setImage(null);
      setImagePreview(null);
      return;
    }
    clearErrors("image");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (!image && !data.imageUrl) {
        setError("image", { message: "Product image is required" });
        setIsSubmitting(false);
        return;
      }

      // Validate required fields
      const requiredFields = ["name", "description", "brand", "category", "sku", "price"];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        missingFields.forEach(field => {
          setError(field, { message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` });
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      
      // Ensure numeric fields are properly converted
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        brand: data.brand.trim(),
        category: data.category,
        sku: data.sku.trim(),
        price: parseFloat(data.price) || 0,
        originalPrice: parseFloat(data.originalPrice) || 0,
        stockQuantity: parseInt(data.stockQuantity) || 0,
        discountPercentage: parseFloat(data.discountPercentage) || 0
      };
      
      // Validate numeric fields
      if (isNaN(productData.price) || productData.price <= 0) {
        setError("price", { message: "Price must be a valid number greater than 0" });
        setIsSubmitting(false);
        return;
      }

      if (!image && data.imageUrl) {
        productData.imageUrl = data.imageUrl;
      }
      formData.append("product", JSON.stringify(productData));

      const apiUrl = product ? `http://localhost:5000/api/products/${product._id}` : "http://localhost:5000/api/products";
      const method = product ? axios.put : axios.post;

      const response = await method(apiUrl, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (response.data && response.data.message) {
        toast({ title: "Success", description: response.data.message, className: "bg-white border-green-500 text-green-500" });
      } else {
        toast({ title: "Success", description: `Product ${product ? "updated" : "created"} successfully!`, className: "bg-white border-green-500 text-green-500" });
      }
      reset();
      setImage(null);
      setImagePreview(null);
      onSubmit();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.details || "Failed to save product";
      toast({ title: "Error", description: errorMessage, variant: "destructive", className: "bg-white border-red-500 text-red-500" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Input placeholder="Product Name" {...register("name")} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Textarea placeholder="Description" {...register("description")} />
      <Input placeholder="Brand" {...register("brand")} />

      <select {...register("category")} className="w-full p-2 border rounded-md">
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>

      <Input type="number" placeholder="Stock Quantity" {...register("stockQuantity")} />
      <Input type="number" placeholder="Price" {...register("price")} />
      <Input type="number" placeholder="Original Price (optional)" {...register("originalPrice")} />
      <Input placeholder="SKU" {...register("sku")} />
      <Input type="number" placeholder="Discount Percentage (optional)" {...register("discountPercentage")} />

      <Input type="file" onChange={handleImageUpload} accept="image/jpeg,image/png,image/gif" />
      {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

      {imagePreview && (
        <img src={imagePreview.startsWith("blob:") ? imagePreview : `http://localhost:5000${imagePreview}`} 
             alt="Product Preview" className="w-32 h-32 object-cover rounded-md mt-2" />
      )}

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Product"}</Button>
    </form>
  );
};

export default AddProductForm;
