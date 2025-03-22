import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartCount(count);
  }, [cart]);

  const addToCart = (product, quantity, size, color) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast({
          title: "Cart updated",
          description: `${product.name} quantity updated in cart.`,
        });
        return updatedCart;
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart.`,
        });
        return [...prevCart, { product, quantity, size, color }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.product.id !== productId);
      toast({
        title: "Item removed",
        description: "Product removed from your cart.",
      });
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
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
        cartCount
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
