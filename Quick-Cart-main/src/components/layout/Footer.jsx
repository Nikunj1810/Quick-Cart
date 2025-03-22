import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "You've successfully subscribed to our newsletter.",
    });
    // Reset the form
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="bg-black text-white p-8 rounded-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">STAY UPTO DATE ABOUT OUR LATEST OFFERS</h3>
            </div>
            <div>
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-white text-black py-6"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white text-black hover:bg-gray-200 py-6"
                >
                  Subscribe to Newsletter
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Store Description */}
          <div className="lg:col-span-1">
            <p className="text-gray-600 mb-4">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <Link 
              to="/" 
              className="group flex-shrink-0 inline-block mb-4"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img
                src="/assect/logo.png"
                alt="QuickCart Logo"
                className="h-8 sm:h-10 w-auto rounded-2xl border border-gray-200 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-blue-300"
              />
            </Link>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-medium mb-4 uppercase text-sm">COMPANY</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-black">About</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-black">Features</Link></li>
              <li><Link to="/works" className="text-gray-600 hover:text-black">Works</Link></li>
              <li><Link to="/career" className="text-gray-600 hover:text-black">Career</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 uppercase text-sm">HELP</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-gray-600 hover:text-black">Customer Support</Link></li>
              <li><Link to="/delivery" className="text-gray-600 hover:text-black">Delivery Details</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-black">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-black">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 uppercase text-sm">FAQ</h3>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-gray-600 hover:text-black">Account</Link></li>
              <li><Link to="/deliveries" className="text-gray-600 hover:text-black">Manage Deliveries</Link></li>
              <li><Link to="/orders" className="text-gray-600 hover:text-black">Orders</Link></li>
              <li><Link to="/payments" className="text-gray-600 hover:text-black">Payments</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 uppercase text-sm">RESOURCES</h3>
            <ul className="space-y-2">
              <li><Link to="/ebooks" className="text-gray-600 hover:text-black">Free eBooks</Link></li>
              <li><Link to="/tutorials" className="text-gray-600 hover:text-black">Development Tutorial</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-black">How to - Blog</Link></li>
              <li><Link to="/playlist" className="text-gray-600 hover:text-black">Youtube Playlist</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 text-center">
            Quick Cart © 2000-2025, All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;