import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { CheckCircle } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  // Redirect to home if accessed directly without completing checkout
  useEffect(() => {
    const hasOrderCompleted = sessionStorage.getItem("orderCompleted");
    if (!hasOrderCompleted) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been placed successfully. We'll send you a confirmation email with your order details shortly.
          </p>
          
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>You'll receive an order confirmation email with details of your purchase.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Your order will be processed and prepared for shipping.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Once your order ships, we'll send you tracking information.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>You can check your order status anytime in your account profile.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/shop">
              <button className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-8 py-3 rounded">
                Continue Shopping
              </button>
            </Link>
            <Link to="/profile">
              <button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black border border-gray-300 px-8 py-3 rounded">
                View My Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmation;