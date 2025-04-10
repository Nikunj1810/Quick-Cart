import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Show buffer screen for 2 seconds before starting logout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear user session
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("sessionExpires");
      
      toast({
        title: "Goodbye!",
        description: "You have been successfully logged out from your account.",
        variant: "default",
        className: "bg-white border-green-500 text-black",
      });

      // Delay navigation to show toast, but don't reload the page
      setTimeout(() => {
        navigate("/");
        // Removed window.location.reload() to prevent white screen issues
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
        className: "bg-white border-red-500 text-black",
      });
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Buffer Screen */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Logging out...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto py-12 px-4 flex flex-col items-center">
        <div className="max-w-lg w-full bg-white shadow-md rounded-xl p-8 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <User className="h-12 w-12 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">My Profile</h1>
              <p className="text-gray-500">Welcome, {user.firstName}!</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <h2 className="text-sm text-gray-500">First Name</h2>
              <p className="text-lg font-semibold text-black">{user.firstName}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <h2 className="text-sm text-gray-500">Email</h2>
              <p className="text-lg font-semibold text-black">{user.email}</p>
            </div>

            {user.lastName && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <h2 className="text-sm text-gray-500">Last Name</h2>
                <p className="text-lg font-semibold text-black">{user.lastName}</p>
              </div>
            )}

            {user.phone && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <h2 className="text-sm text-gray-500">Phone</h2>
                <p className="text-lg font-semibold text-black">{user.phone}</p>
              </div>
            )}

            {user.address && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <h2 className="text-sm text-gray-500">Address</h2>
                <p className="text-lg font-semibold text-black">{user.address}</p>
              </div>
            )}
          </div>

          <Button
            variant="default"
            className="w-full mt-8 bg-black hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center transition-all duration-300"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
            {!isLoading && <LogOut className="ml-2 h-5 w-5" />}
          </Button>

        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
