import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated: isAdmin } = useAdmin();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Log the productId to check if it's correctly retrieved
  useEffect(() => {
    console.log("Product ID:", productId);
  }, [productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);

        // Fetch related products
        const relatedResponse = await fetch(`http://localhost:5000/api/products?category=${data.category}&limit=4`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData.products.filter(p => p._id !== productId));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          className: "bg-white border-red-500 text-red-500"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading product details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Error", description: "Please select a size", variant: "destructive" });
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      toast({ title: "Error", description: "Please select a color", variant: "destructive" });
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast({ title: "Added to Cart", description: `${product.name} added successfully!`, className: "bg-white border-green-500 text-green-500" });
  };

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete product");

        toast({ title: "Success", description: "Product deleted successfully", className: "bg-white border-green-500 text-green-500" });
        navigate("/admin/products");
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-500 hover:text-black">Home</Link>
          <span className="text-gray-500">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-black">Shop</Link>
          <span className="text-gray-500">/</span>
          <span className="font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <img
              src={`http://localhost:5000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-medium">₹{product.price}</p>

            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Select Colors</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button className="px-3 py-2 border" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
                <Minus />
              </button>
              <input className="w-12 text-center" type="number" value={quantity} readOnly />
              <button className="px-3 py-2 border" onClick={() => setQuantity(quantity + 1)}>
                <Plus />
              </button>
            </div>

            <Button className="mt-6" onClick={handleAddToCart}>
              Add to Cart
            </Button>

            {isAdmin && (
              <div className="flex gap-4 mt-6">
                <Link to={`/admin/products/${productId}`} className="text-blue-600 hover:text-blue-800">
                  <Pencil /> Edit
                </Link>
                <button onClick={handleDeleteProduct} className="text-red-600 hover:text-red-800">
                  <Trash2 /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
