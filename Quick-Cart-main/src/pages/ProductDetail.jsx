import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { isLoggedIn } from "@/utils/auth";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Product not found");
        setProduct(data);
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

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      setShowLoginDialog(true);
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Error",
        description: "Please select a size",
        variant: "destructive",
        className: "bg-white border-black text-black rounded-lg shadow-lg"
      });
      return;
    }
    
    // Determine size type based on product category or default to standard
    const sizeType = product.category?.includes('pants') ? 'waist' : 'standard';

    try {
      setIsLoading(true);
      await addToCart(product, quantity, selectedSize, sizeType);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
        className: "bg-white border-red-500 text-red-500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to delete product");
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        navigate("/admin/products");
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

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
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
      </MainLayout>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-[300px] md:h-[400px] w-full max-w-[500px] mx-auto rounded-xl overflow-hidden">
            <div className="w-full h-full overflow-hidden rounded-xl bg-gray-50">
              <img
                src={`http://localhost:5000${product.imageUrl}`}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              {/* Optional: New Arrival Tag */}
              {/* {product.isNewArrival && (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  🆕 New Arrival
                </span>
              )} */}

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-black">₹{product.price}</p>
                {product.originalPrice > product.price && (
                  <>
                    <p className="text-xl text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </p>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full animate-pulse">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {product.sizes?.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-4">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((sizeObj) => (
                    <button
                      key={sizeObj._id}
                      className={`px-6 py-3 border-2 rounded-lg font-medium transition-all
                        ${selectedSize === sizeObj.size ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"}
                        ${sizeObj.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      disabled={sizeObj.quantity === 0}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-4">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color ? "ring-2 ring-black" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-base font-semibold mb-4">Quantity</h3>
              <div className="flex items-center gap-4 w-fit border-2 border-gray-200 rounded-lg p-1">
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  className="w-16 text-center text-lg font-medium bg-transparent"
                  type="number"
                  value={quantity}
                  readOnly
                />
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="rounded-full bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors duration-300"
            >
              Add to Cart
            </button>

            {/* Login Dialog */}
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
              <DialogContent className="sm:max-w-[425px] bg-white shadow-2xl border-2 border-black/10 rounded-[32px] transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-black/20">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                    Login Required
                  </DialogTitle>
                  <DialogDescription className="text-center text-base text-gray-600 leading-relaxed">
                    Please login or create an account to add items to your cart and start shopping!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5 py-6">
                  <Button
                    variant="outline"
                    className="w-full py-6 text-lg font-medium rounded-2xl border-2 hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => {
                      setShowLoginDialog(false);
                      navigate("/login");
                    }}
                  >
                    Login to Your Account
                  </Button>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-gray-100" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-white px-6 text-gray-400 font-semibold tracking-wider">Or</span>
                    </div>
                  </div>
                  <Button
                    className="w-full py-6 text-lg font-medium bg-black text-white rounded-2xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:bg-gray-900"
                    onClick={() => {
                      setShowLoginDialog(false);
                      navigate("/signup");
                    }}
                  >
                    Create New Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex gap-6 pt-4 border-t">
                <Link
                  to={`/admin/products/${productId}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="w-5 h-5" /> Edit Product
                </Link>
                <button
                  onClick={handleDeleteProduct}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" /> Delete Product
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
