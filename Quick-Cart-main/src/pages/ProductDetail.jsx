import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { getProductById, getRelatedProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [activeImage, setActiveImage] = useState(0);

  const product = productId ? getProductById(productId) : undefined;
  const relatedProducts = productId ? getRelatedProducts(productId) : [];

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
      alert("Please select a size");
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const thumbnails = [`http://localhost:5000${product.imageUrl}`, `http://localhost:5000${product.imageUrl}`, `http://localhost:5000${product.imageUrl}`];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 text-sm mb-8">
          <a href="/" className="text-gray-500 hover:text-black">Home</a>
          <span className="text-gray-500">/</span>
          <a href="/shop" className="text-gray-500 hover:text-black">Shop</a>
          <span className="text-gray-500">/</span>
          <span className="font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4 bg-gray-100 rounded-md">
              <img
                src={`http://localhost:5000${product.imageUrl}`}
                alt={product.name}
                className="w-full h-auto rounded-md object-cover aspect-square"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  className={`border-2 rounded-md overflow-hidden ${
                    activeImage === index ? "border-black" : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={thumb}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-auto aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-medium mb-4">₹{product.price}</p>

            {product.description && (
              <p className="text-gray-600 mb-6">{product.description}</p>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Select Colors</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${
                        selectedColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Choose Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center mb-6 gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  className="px-3 py-2 border-r border-gray-300"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-12 px-3 py-2 text-center appearance-none"
                />
                <button
                  className="px-3 py-2 border-l border-gray-300"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white py-6"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="py-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
