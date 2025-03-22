import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductForm from "@/components/admin/product/ProductForm";
import CategoryManager from "@/components/admin/product/CategoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getAllCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleProductChecked,
} from "@/services/product-service";

const AdminProductDetails = () => {
  const { productId } = useParams();
  const isNewProduct = !productId || productId === "new";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);

        if (!isNewProduct) {
          const productData = await getProduct(productId);
          if (productData) {
            setProduct(productData);
          } else {
            toast({
              title: "Error",
              description: "Product not found",
              variant: "destructive",
            });
            navigate("/admin/products");
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, isNewProduct, navigate, toast]);

  const handleProductSubmit = async (data, imageFile) => {
    try {
      if (isNewProduct) {
        const newProduct = await createProduct(data, imageFile);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        navigate(`/admin/products/${newProduct.id}`);
      } else {
        const updatedProduct = await updateProduct(productId, data, imageFile);
        setProduct(updatedProduct);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleProductDelete = async () => {
    if (!productId) return;

    try {
      await deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      navigate("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleToggleChecked = async () => {
    if (!productId || !product) return;

    try {
      const updatedProduct = await toggleProductChecked(productId);
      if (updatedProduct) {
        setProduct(updatedProduct);
        toast({
          title: updatedProduct.checked ? "Product Checked" : "Product Unchecked",
          description: `${updatedProduct.name} has been ${updatedProduct.checked ? "added to" : "removed from"} checked products`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const newCategory = await createCategory(name);
      setCategories([...categories, newCategory]);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCategory = async (id, name) => {
    try {
      const updatedCategory = await updateCategory(id, name);
      setCategories(categories.map((cat) => (cat.id === id ? updatedCategory : cat)));
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

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
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProductDetails;
