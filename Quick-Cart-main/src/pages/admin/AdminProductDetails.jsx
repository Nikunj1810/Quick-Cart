import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductForm from "@/components/admin/product/ProductForm";
import CategoryManager from "@/components/admin/product/CategoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ✅ Helpers
const BASE_URL = "http://localhost:5000";

const removeBaseUrl = (url) => url?.replace(/^https?:\/\/[^/]+/, "") || "";

// ✅ Services
const getAllCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/categories`);
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch categories");
  return res.json();
};

const getProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch product");
  const product = await res.json();
  product.imageUrl = product.imageUrl ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${BASE_URL}${product.imageUrl}`) : "";
  product.checked = product.checked || false;
  return product;
};

const createProduct = async (product, imageFile) => {
  const formData = new FormData();
  if (imageFile) formData.append("image", imageFile);
  formData.append("product", JSON.stringify(product));

  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error((await res.json()).error || "Failed to create product");
  return res.json();
};

const updateProduct = async (id, updates, imageFile) => {
  const formData = new FormData();
  if (imageFile) {
    formData.append("image", imageFile);
  } else if (updates.imageUrl || updates.existingImageUrl) {
    formData.append("imageUrl", removeBaseUrl(updates.imageUrl || updates.existingImageUrl));
  }

  formData.append("updates", JSON.stringify(updates));

  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error((await res.json()).error || "Failed to update product");
  const updatedProduct = await res.json();
  updatedProduct.imageUrl = updatedProduct.imageUrl ? (updatedProduct.imageUrl.startsWith("http") ? updatedProduct.imageUrl : `${BASE_URL}${updatedProduct.imageUrl}`) : "";
  return updatedProduct;
};

const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to delete product");
};

const toggleProductChecked = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}/toggle`, { method: "PUT" });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to toggle product status");
  return res.json();
};

// ✅ Main Component
const AdminProductDetails = () => {
  const { productId } = useParams();
  const isNewProduct = !productId || productId === "new";
  const navigate = useNavigate();

  const [product, setProduct] = useState();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [cats, prod] = await Promise.all([
          getAllCategories(),
          isNewProduct ? Promise.resolve(undefined) : getProduct(productId),
        ]);
        setCategories(cats);
        if (prod) setProduct(prod);
        else if (!isNewProduct) {
          toast.error("Product not found");
          navigate("/admin/products");
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [productId, isNewProduct, navigate]);

  const handleProductSubmit = async (data, imageFile) => {
    try {
      if (isNewProduct) {
        const newProd = await createProduct(data, imageFile);
        toast.success("Product created successfully");
        navigate(`/admin/products/${newProd._id}`);
      } else {
        const updated = await updateProduct(productId, {
          ...data,
          existingImageUrl: product?.imageUrl,
        }, imageFile);
        setProduct(updated);
        toast.success("Product updated successfully");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save product.");
    }
  };

  const handleProductDelete = async () => {
    try {
      const confirmDelete = await toast.promise(
        new Promise((resolve, reject) => {
          toast(
            "Are you sure you want to delete this product?",
            {
              action: {
                text: "Confirm",
                onClick: () => resolve(true),
              },
              cancel: {
                text: "Cancel",
                onClick: () => reject(false),
              },
            }
          );
        })
      );

      if (confirmDelete) {
        await deleteProduct(productId);
        toast.success("Product deleted successfully");
        navigate("/admin/products");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete product.");
    }
  };

  const handleToggleChecked = async () => {
    try {
      const updated = await toggleProductChecked(productId);
      setProduct(updated);
      toast.success(`${updated.name} has been ${updated.checked ? "added to" : "removed from"} checked products`);
    } catch (err) {
      toast.error(err.message || "Failed to toggle product.");
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Product Details</h1>
          <div className="text-sm text-gray-500">
            <Link to="/admin/dashboard" className="hover:underline">Home</Link> &gt;{" "}
            <Link to="/admin/products" className="hover:underline">All Products</Link> &gt;{" "}
            {isNewProduct ? "Add New Product" : "Edit Product"}
          </div>
        </div>

        {!isNewProduct && product && (
          <div className="flex items-center gap-2">
            <span className="text-sm mr-2">Mark as checked:</span>
            <Checkbox
              checked={product.checked}
              onCheckedChange={handleToggleChecked}
              className="data-[state=checked]:bg-green-500 border-gray-300"
            />
          </div>
        )}
      </div>

      <Tabs defaultValue="product" className="w-full">
        <TabsList>
          <TabsTrigger value="product">Product Details</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="product" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <ProductForm
                product={product}
                onSubmit={handleProductSubmit}
                onDelete={!isNewProduct ? handleProductDelete : undefined}
                categories={categories}
                isNew={isNewProduct}
                existingImageUrl={product?.imageUrl}
                labels={{
                  name: "Product Name",
                  description: "Product Description",
                  price: "Product Price",
                  category: "Product Category",
                  image: "Product Image",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProductDetails;
