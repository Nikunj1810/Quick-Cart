import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { cartApi } from "@/services/api";
import { useUser } from "@/context/UserContext";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setCart([]);
      setCartTotal(0);
      setCartCount(0);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartData = await cartApi.getCart();
        setCart(cartData.items || []);
      } catch (err) {
        if (err.message === 'User not authenticated') {
          setCart([]);
          setCartTotal(0);
          setCartCount(0);
        } else {
          setError(err.message);
          toast({
            title: "Error",
            description: "Failed to fetch cart",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      return sum + ((item.product?.price || 0) * item.quantity);
    }, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartCount(count);
  }, [cart]);

  const addToCart = async (product, quantity, size, sizeType) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to add items to your cart",
        variant: "destructive"
      });
      return;
    }
    if (!product || !product._id) {
      toast({
        title: "Error",
        description: "Invalid product information",
        variant: "destructive",
      });
      return;
    }

    if (quantity < 1) {
      toast({
        title: "Error",
        description: "Quantity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await cartApi.addToCart(product._id, quantity, size, sizeType);
      const cartData = await cartApi.getCart();
      setCart(cartData.items || []);
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart.`,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, size = 'M', sizeType = 'standard') => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to remove items from your cart",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoading(true);
      await cartApi.removeFromCart(productId, size, sizeType);
      const cartData = await cartApi.getCart();
      setCart(cartData.items || []);
      toast({
        title: "Item removed",
        description: "Product removed from your cart.",
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity, size = 'M', sizeType = 'standard') => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to update your cart",
        variant: "destructive"
      });
      return;
    }
    if (quantity <= 0) {
      await removeFromCart(productId, size, sizeType);
      return;
    }

    try {
      setLoading(true);
      await cartApi.updateQuantity(productId, quantity, size, sizeType);
      const cartData = await cartApi.getCart();
      setCart(cartData.items || []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to update cart quantity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to clear your cart",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoading(true);
      await cartApi.clearCart();
      setCart([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading,
        error
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
