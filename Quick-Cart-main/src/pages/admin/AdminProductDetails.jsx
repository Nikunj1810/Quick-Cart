import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductForm from "@/components/admin/product/ProductForm";
import CategoryManager from "@/components/admin/product/CategoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
const getAllCategories = async () => {
  const response = await fetch('http://localhost:5000/api/categories');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch categories');
  }
  return await response.json();
};

const getProduct = async (id) => {
  const response = await fetch(`http://localhost:5000/api/products/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch product');
  }
  const product = await response.json();
  if (product.imageUrl) {
    product.imageUrl = `http://localhost:5000${product.imageUrl}`;
  }
  product.checked = product.checked || false;
  return product;
};

const createProduct = async (product, imageFile) => {
  const formData = new FormData();
  if (imageFile) {
    formData.append('image', imageFile);
  }
  formData.append('product', JSON.stringify(product));

  const response = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create product');
  }
  return await response.json();
};

const updateProduct = async (id, updates, imageFile) => {
  const formData = new FormData();
  if (imageFile) {
    formData.append('image', imageFile);
  }
  formData.append('updates', JSON.stringify(updates));

  const response = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'PUT',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update product');
  }
  return await response.json();
};

const deleteProduct = async (id) => {
  const response = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete product');
  }
};



const toggleProductChecked = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}/toggle`, {
      method: 'PUT'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to toggle product status');
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to toggle product status: ${error.message}`);
  }
};

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
            console.log("Fetched product data:", productData);
          } else {
            toast({
              title: "Error",
              description: "Product not found",
              variant: "destructive",
              className: "bg-transparent border-black text-black rounded-lg shadow-lg"
            });
            navigate("/admin/products");
          }
        }
      } catch (error) {
        console.error("Error loading product data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load product data. Please try again.",
          variant: "destructive",
          className: "bg-white border-red-500 text-red-500 rounded-lg shadow-lg"
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
        if (newProduct && newProduct._id) {
          toast({
            title: "Success",
            description: "Product created successfully",
            className: "bg-white border-green-500 text-green-500 rounded-lg shadow-lg"
          });
          navigate(`/admin/products/${newProduct._id}`);
        } else {
          throw new Error("Failed to create product - invalid response from server");
        }
      } else {
        const updatedProduct = await updateProduct(productId, data, imageFile);
        setProduct(updatedProduct);
        toast({
          title: "Success",
          description: "Product updated successfully",
          className: "bg-white border-green-500 text-green-500 rounded-lg shadow-lg"
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product. Please check your input and try again.",
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
        className: "bg-white border-green-500 text-green-500 rounded-lg shadow-lg"
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product. Please try again.",
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
      console.error("Error toggling product status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product status. Please try again.",
        variant: "destructive",
      });
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
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProductDetails;