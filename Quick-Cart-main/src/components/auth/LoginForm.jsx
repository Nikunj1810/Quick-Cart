import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const LoginForm = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(credentials);
      if (success) {
        // Show buffer screen for 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000));
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-500 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            {/* 🔹 Animated Spinner */}
            <div className="w-14 h-14 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
              Logging in...
            </p>
          </div>
        </div>
      )}

      {/* 🔹 Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-black text-white py-2 rounded transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {isLoading ? "Please wait..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
