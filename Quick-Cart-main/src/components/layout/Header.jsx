import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  X,
  Search,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated } = useUser();
  const { isAuthenticated: isAdminAuthenticated } = useAdmin();
  const [showPromo, setShowPromo] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const handleAdminDashboard = () => navigate("/admin/dashboard");

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      {/* Promo Banner */}
      {showPromo && (
        <div className="bg-black text-white py-2 px-4 flex justify-center items-center relative text-center">
          <p className="text-xs sm:text-sm font-medium">
            Our Spring Sale is live! Don’t miss out on exclusive deals.
            <Link to="/shop" className="underline ml-1">
              Shop Now
            </Link>
          </p>

          <button
            onClick={() => setShowPromo(false)}
            className="absolute right-2 sm:right-4"
            aria-label="Close promotion"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="border-b border-gray-200 py-2 sm:py-3">
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo and Nav */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link
              to="/"
              className="group flex-shrink-0"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img
                src="/assets/logo.png"
                alt="QuickCart Logo"
                className="h-8 sm:h-10 w-auto rounded-2xl border border-gray-200 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-blue-300"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/shop"
                className="text-sm font-medium hover:text-blue-600"
                onClick={() => window.scrollTo(0, 0)}
              >
                Shop
              </Link>
              <Link
                to="/about-us"
                className="text-sm font-medium hover:text-blue-600"
                onClick={() => window.scrollTo(0, 0)}
              >
                About Us
              </Link>
              <Link
                to="/contact-us"
                className="text-sm font-medium hover:text-blue-600"
                onClick={() => window.scrollTo(0, 0)}
              >
                Contact Us
              </Link>

              {/* Remove the login button from here */}

              {isAdminAuthenticated && (
                <Button
                  onClick={handleAdminDashboard}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-blue-700 border-blue-700 hover:bg-blue-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              )}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Search */}
            <div className="relative hidden lg:flex">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 xl:w-[830px]">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400"
                />
              </div>
            </div>

            {/* Mobile Search */}
            {showSearch ? (
              <div className="relative lg:hidden">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="rounded-full bg-gray-100 border-gray-200 pr-9 w-48 sm:w-64"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-1"
                  onClick={() => setShowSearch(false)}
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSearch(true)}
                className="lg:hidden"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Cart & Account */}
            <Link to="/cart" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login Button */}
            {!isAuthenticated ? (
              <Link to="/login">
                <Button
                  variant="outline"
                  className="px-6 py-2 bg-black text-white border-2 border-black
                    rounded-3xl font-medium transition-all duration-300 
                    hover:bg-white hover:text-black
                    active:scale-95"
                >
                  Login
                </Button>
              </Link>
            ) : (
              <Link to="/profile" aria-label="Profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full border-2 border-black transition-all duration-300 
                    hover:bg-black hover:text-white"
                >
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            )}

            {/* Admin shortcut on mobile */}
            {isAdminAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAdminDashboard}
                className="md:hidden text-blue-700"
                aria-label="Admin Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 h-full fixed top-0 left-0 z-50 bg-white">
              <div className="flex flex-col gap-6 mt-8">
                  <Link
                    to="/shop"
                    className="text-lg font-medium"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Shop
                  </Link>
                  <Link
                    to="/about-us"
                    className="text-lg font-medium"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact-us"
                    className="text-lg font-medium"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Contact Us
                  </Link>
                  {isAdminAuthenticated && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 text-lg font-medium text-blue-700"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
