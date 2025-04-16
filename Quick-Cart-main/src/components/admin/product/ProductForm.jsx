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
  stockQuantity: z.coerce.number().min(0).optional(),
  price: z.coerce.number().min(1),
  originalPrice: z.coerce.number().min(0).optional(),
  sku: z.string().min(2),
  gender: z.enum(["Men", "Women", "Unisex"], { required_error: "Gender is required" }),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  imageUrl: z.string().optional(),
  sizeType: z.enum(["standard", "waist"]),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        quantity: z.coerce.number().min(0, "Quantity must be 0 or more"),
      })
    )
    .min(1, "At least one size is required"),
  isNewArrival: z.boolean().optional(),
});

const AddProductForm = ({ product = null, onSubmit = () => {} }) => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      sizeType: "standard",
      isNewArrival: false,
      sizes: [{ size: "", quantity: 0 }],
    },
  });

  const sizes = watch("sizes", []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
          className: "bg-white border-red-500 text-red-500",
        })
      );
  }, []);

  const addSize = () => {
    setValue("sizes", [...sizes, { size: "", quantity: 0 }]);
  };

  const updateSize = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = field === "quantity" ? parseInt(value) || 0 : value;
    setValue("sizes", updatedSizes);
  };

  const removeSize = (index) => {
    setValue("sizes", sizes.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast({ title: "Error", description: "Invalid file type", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image exceeds 5MB", variant: "destructive" });
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onFormSubmit = async (data) => {
    try {
      if (!image && !data.imageUrl && !product) {
        toast({ title: "Error", description: "Product image is required for new products", variant: "destructive" });
        return;
      }

      const productData = {
        ...data,
        sizes,
        price: parseFloat(data.price),
        originalPrice: parseFloat(data.originalPrice) || 0,
        stockQuantity: parseInt(data.stockQuantity) || 0,
        discountPercentage: parseFloat(data.discountPercentage) || 0,
      };

      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      
      // Format data differently for create vs update
      if (product) {
        formData.append("updates", JSON.stringify(productData));
      } else {
        formData.append("product", JSON.stringify(productData));
      }

      const apiUrl = product
        ? `http://localhost:5000/api/products/${product._id}`
        : "http://localhost:5000/api/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: result.message || "Product saved successfully!",
        className: "bg-white border-green-500 text-green-500",
      });

      reset();
      setValue("sizes", [{ size: "", quantity: 0 }]);
      setImage(null);
      setImagePreview(null);
      onSubmit();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Something went wrong",
        variant: "destructive",
        className: "bg-white border-red-500 text-red-500",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Input placeholder="Product Name" {...register("name")} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Textarea placeholder="Description" {...register("description")} />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

      <Input placeholder="Brand" {...register("brand")} />
      {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}

      <select {...register("category")} className="w-full p-2 border rounded-md">
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

      <Input placeholder="SKU" {...register("sku")} />
      {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}

      <select {...register("gender")} className="w-full p-2 border rounded-md">
        <option value="">Select Gender</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Unisex">Unisex</option>
      </select>
      {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
      
      <Input type="number" placeholder="Stock Quantity" {...register("stockQuantity")} />
      <Input type="number" placeholder="Price" {...register("price")} />
      <Input type="number" placeholder="Original Price" {...register("originalPrice")} />
      <Input type="number" placeholder="Discount %" {...register("discountPercentage")} />

      <label className="block font-medium">Size Type</label>
      <select {...register("sizeType")} className="w-full p-2 border rounded-md">
        <option value="standard">Standard</option>
        <option value="waist">Waist</option>
      </select>

      <label className="block font-medium mt-4">Sizes</label>
      {sizes.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <Input
            {...register(`sizes.${i}.size`, { required: "Size is required" })}
            value={entry.size}
            onChange={(e) => updateSize(i, "size", e.target.value)}
          />
          <Input
            type="number"
            {...register(`sizes.${i}.quantity`, { required: "Quantity is required" })}
            value={entry.quantity}
            onChange={(e) => updateSize(i, "quantity", e.target.value)}
          />
          <Button type="button" onClick={() => removeSize(i)}>Remove</Button>
        </div>
      ))}
      <Button type="button" onClick={addSize}>Add Size</Button>

      <input type="checkbox" {...register("isNewArrival")} />
      <label>New Arrival</label>

      <Input type="file" onChange={handleImageUpload} accept="image/jpeg,image/png,image/gif" />
      {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 mt-2 rounded-md" />}

      <Button type="submit">Save Product</Button>
    </form>
  );
};

export default AddProductForm;
