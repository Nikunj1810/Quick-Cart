import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative").optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  originalPrice: z.coerce.number().min(0, "Original price cannot be negative").optional(),
  tags: z.string().optional(),
});

const ProductForm = ({ product, onSubmit, onDelete, categories, isNew = false }) => {
  const [image, setImage] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "",
      brand: product?.brand || "",
      sku: product?.sku || "",
      stock: product?.stock || 0,
      price: product?.price || 0,
      originalPrice: product?.originalPrice || 0,
      tags: product?.tags?.join(", ") || "",
    },
  });

  const handleImageUpload = (file) => {
    const url = URL.createObjectURL(file);
    setImage({ url, file, id: Date.now().toString() });
  };

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data, image?.file);
      toast({
        title: isNew ? "Product created" : "Product updated",
        description: isNew ? "Your product has been created successfully" : "Your product has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      await onDelete();
      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the product",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type name here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type description here" rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type brand name here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. PROD-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="tag1, tag2, tag3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FileInput
              label="Product Image"
              buttonText="Upload Image"
              preview={image?.url || product?.imageUrl}
              onFileSelected={handleImageUpload}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          {!isNew && onDelete && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              DELETE
            </Button>
          )}
          <Button type="button" variant="outline">CANCEL</Button>
          <Button type="submit">{isNew ? 'SAVE PRODUCT' : 'UPDATE'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
