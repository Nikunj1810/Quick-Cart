import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
const getAllProducts = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
import { toast } from "@/components/ui/use-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch products';
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        setError(errorMessage);
        setLoading(false);
      }
    };
    
    fetchProducts();
    
    return () => {
      // Cleanup function to cancel pending requests if component unmounts
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild className="rounded-sm">
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            ADD NEW PRODUCT
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/admin/products/${product.id}`}
                  className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default AdminProducts;