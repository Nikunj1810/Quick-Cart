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
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/admin/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
<<<<<<< Updated upstream
        await login(email, password, rememberMe);
=======
        await login(email, password, true); // Set remember=true to persist admin session

        toast.success("Login successful", {
          description: "Welcome to QuickCart Admin Dashboard!",
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
>>>>>>> Stashed changes
        navigate("/admin/dashboard");
      } else {
        console.error("Login error:", data.error);
      }
<<<<<<< Updated upstream
    } catch (error) {
      console.error("Login error:", error);
=======
    } catch {
      toast.error("Login failed", {
        description: "Something went wrong. Please try again.",
      });
>>>>>>> Stashed changes
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keep me logged in
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 flex items-center justify-center"
            disabled={isLoading}
          >
            EMAIL LOGIN
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
