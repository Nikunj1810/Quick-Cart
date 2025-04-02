import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { useAdmin } from "../../context/AdminContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/admin/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        localStorage.setItem("adminToken", data.token);
        await login(email, password);
        
        // Show buffer screen for 2 seconds before navigation
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate("/admin/dashboard");
      } else {
        setErrorMessage(data.error || "Invalid email or password");
        console.error("Login error:", data.error);
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      {/* Buffer Screen */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300 ease-in-out z-50">
          <div className="bg-white/90 p-8 rounded-xl shadow-2xl flex flex-col items-center transform transition-all duration-500 scale-100 opacity-100">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin transition-all duration-1000 ease-in-out"></div>
            <p className="mt-4 text-lg font-semibold text-gray-800 animate-pulse">Logging in...</p>
          </div>
        </div>
      )}
      <div className="mb-10">
        <div className="flex justify-center mb-4">
          <h1 className="text-3xl font-bold tracking-tighter">QuickCart</h1>
        </div>
        <p className="text-sm text-center uppercase tracking-widest text-gray-500">STORE</p>
      </div>

      <div className="w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-2">Login</h2>
        <p className="text-blue-600 hover:underline mb-6 cursor-pointer">
          Forgot your password?
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 flex items-center justify-center"
            disabled={isLoading}
          >
            LOGIN
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
