import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is stored in localStorage
    const storedAdmin = localStorage.getItem("quickcart-admin");
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse admin data:", error);
        localStorage.removeItem("quickcart-admin");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, remember = false) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just simulate a successful login
      if (email && password) {
        const mockAdmin = {
          id: "admin1",
          name: "Admin User",
          email: email,
          role: "admin",
        };
        
        setAdmin(mockAdmin);
        setIsAuthenticated(true);
        
        if (remember) {
          localStorage.setItem("quickcart-admin", JSON.stringify(mockAdmin));
        }
        
        setIsLoading(false);
        return true;
      }
      
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem("quickcart-admin");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out of admin panel.",
    });
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};