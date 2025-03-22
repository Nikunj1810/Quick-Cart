import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";  // Add this import

function Register() {
  const { toast } = useToast();  // Add this hook
  const navigate = useNavigate();
  const { register } = useUser();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
      e.preventDefault();
      setIsLoading(true);
  
      try {
          const response = await fetch('http://localhost:5000/api/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData)
          });
  
          const data = await response.json();
  
          if (response.ok) {
              setFormData({
                  firstName: "",
                  lastName: "",
                  phone: "",
                  address: "",
                  email: "",
                  password: "",
              });
              toast({
                  title: "Success",
                  description: "Registration successful!",
                  variant: "default",
                  className: "bg-white border-green-500 text-green-500", // Add solid background
              });
          } else {
              toast({
                  title: "Error",
                  description: data.error || "Registration failed. Please try again.",
                  variant: "destructive",
                  className: "bg-white border-red-500 text-red-500", // Add solid background
              });
          }
      } catch (error) {
          console.error("Registration error:", error);
          toast({
              title: "Error",
              description: "Registration failed. Please try again.",
              variant: "destructive",
          });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-500 hover:text-black">Home</Link>
          <span className="text-gray-500">/</span>
          <span className="font-medium">Register</span>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="border border-gray-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <p className="mb-6">Sign up with</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full py-6"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full py-6"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />

                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone No."
                  className="w-full py-6"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <Input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="w-full py-6"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Login Details */}
              <div>
                <h2 className="text-lg font-medium mb-4">Login Details</h2>
                <div className="space-y-4">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full py-6"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full py-6"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Minimum 8 characters with at least one uppercase, one lowercase, one special
                      character and a number
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-6 flex items-center justify-center"
                disabled={isLoading}
              >
                REGISTER
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Login Redirect */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Register;
