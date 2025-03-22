import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
      className: "bg-white border-red-500 text-red-500",
    });
    navigate("/login");
  };

  return (
    <MainLayout>
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
          >
            Logout
            <LogOut className="ml-2 h-5 w-5" />
          </Button>

        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
