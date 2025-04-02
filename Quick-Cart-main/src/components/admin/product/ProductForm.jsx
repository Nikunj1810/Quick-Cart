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
  prodId: z.string().regex(/^PROD-\d+$/, "Product ID must be in format PROD-XXXX"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  brand: z.string().min(2, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  stockQuantity: z.coerce.number().min(0, "Stock cannot be negative").optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  originalPrice: z.coerce.number().min(0, "Original price cannot be negative").optional(),
  sku: z.string().min(2, "SKU is required"),
  discountPercentage: z.coerce.number().min(0).max(100, "Discount must be between 0-100").optional(),
});

const AddProductForm = ({ onSubmit = () => {} }) => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema) });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load categories",
          variant: "destructive",
        });
      }
    };
    
    fetchCategories();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("image", { 
        type: "manual", 
        message: "Product image is required" 
      });
      setImage(null);
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("image", { 
        type: "manual", 
        message: "Invalid file type. Please upload a JPEG, JPG, PNG, or GIF image" 
      });
      setImage(null);
      return;
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("image", { 
        type: "manual", 
        message: "Image size exceeds 5MB limit. Please upload a smaller file" 
      });
      setImage(null);
      return;
    }

    clearErrors("image");
    setImage(file);
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (!image) {
        setError("image", { 
          type: "manual", 
          message: "Product image is required" 
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", image);
      
      // Append all product data to FormData
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      // Send all data in a single request
      const productRes = await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (productRes.status === 201) {
        toast({ title: "Success", description: "Product added successfully!" });
        reset();
        setImage(null);
        onSubmit();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to save product";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setError("image", { type: "manual", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Input placeholder="Product ID (PROD-XXXX)" {...register("prodId")} />
      {errors.prodId && <p className="text-red-500 text-sm">{errors.prodId.message}</p>}

      <Input placeholder="Product Name" {...register("name")} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Textarea placeholder="Description" {...register("description")} />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

      <Input placeholder="Brand" {...register("brand")} />
      {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}

      <select {...register("category")}>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>
      {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

      <Input placeholder="Stock Quantity" type="number" {...register("stockQuantity")} />
      {errors.stockQuantity && <p className="text-red-500 text-sm">{errors.stockQuantity.message}</p>}

      <Input placeholder="Price" type="number" {...register("price")} />
      {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

      <Input placeholder="Original Price" type="number" {...register("originalPrice")} />
      {errors.originalPrice && <p className="text-red-500 text-sm">{errors.originalPrice.message}</p>}

      <Input placeholder="SKU" {...register("sku")} />
      {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}

      <Input placeholder="Discount %" type="number" {...register("discountPercentage")} />
      {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage.message}</p>}

      <Input type="file" onChange={handleImageUpload} accept="image/jpeg,image/png,image/gif" />
      {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
};

export default AddProductForm