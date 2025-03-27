import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { getNewArrivals, getFeaturedProducts } from "@/data/products";

const BrandLogo = ({ name }) => (
  <div className="flex items-center justify-center py-3 transition-all grayscale hover:grayscale-0">
    <p className="text-lg font-bold tracking-wider">{name}</p>
  </div>
);

const Home = () => {
  const newArrivals = getNewArrivals();
  const topSelling = getFeaturedProducts();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-5 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative rounded-2xl overflow-hidden h-[600px]">
              <img 
                src="/assets/Hero.png" 
                alt="Fashion models" 
                className="object-cover w-full h-full" 
              />
            </div>

            <div className="space-y-8">
              <div className="flex justify-between">
                <div className="text-center">
                  <p className="text-4xl font-bold font-['Times_New_Roman']">200+</p>
                  <p className="text-gray-600 text-base font-['Times_New_Roman']">International Brands</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold font-['Times_New_Roman']">2,000+</p>
                  <p className="text-gray-600 text-base font-['Times_New_Roman']">High-Quality Products</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold font-['Times_New_Roman']">30,000+</p>
                  <p className="text-gray-600 text-base font-['Times_New_Roman']">High-Quality Products</p>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-center md:text-6xl">
                You can have anything you want in life if you dress for it.
              </h1>
              
              <p className="text-lg text-center text-gray-600">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
              </p>
              
              <div className="flex justify-center">
                <Button className="px-12 py-3 text-lg text-white bg-black rounded-full hover:bg-gray-900">
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Brands */}
      <section className="py-1 bg-black">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
            <img src="/assets/prada.png" alt="prada" className="object-contain h-8 mx-auto" />
            <img src="/assets/mufti.png" alt="Mufti" className="object-contain mx-auto h-14 w-19" />
            <img src="/assets/vanheusen.png" alt="Van Heusen" className="object-contain h-20 mx-auto w-44" />
            <img src="/assets/calvin.png" alt="Calvin Klein" className="object-contain h-8 mx-auto" />
            <img src="/assets/gucci.png" alt="Gucci" className="object-contain h-12 mx-auto" />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h1 className="mb-8 text-5xl font-extrabold text-center uppercase">New Arrivals</h1>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/shop">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Top Selling */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-2xl font-bold lowercase">top selling</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {topSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
          <Link to="/shop">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Browse by Style */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="p-8 bg-gray-100 rounded-lg">
            <h2 className="mb-8 text-2xl font-bold">BROWSE BY dress STYLE</h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link to="/category/casual" className="p-6 transition-shadow bg-white rounded-lg hover:shadow-md">
                <div className="flex flex-col items-center space-y-4">
                  <img src="/assets/casual.png" alt="Casual style" className="object-cover w-full h-40 rounded-md" />
                  <h3 className="text-lg font-medium">Casual</h3>
                </div>
              </Link>
              
              <Link to="/category/formal" className="p-6 transition-shadow bg-white rounded-lg hover:shadow-md">
                <div className="flex flex-col items-center space-y-4">
                  <img src="/assets/formal.png" alt="Formal style" className="object-cover w-full h-40 rounded-md" />
                  <h3 className="text-lg font-medium">Formal</h3>
                </div>
              </Link>
              
              <Link to="/category/party" className="p-6 transition-shadow bg-white rounded-lg hover:shadow-md">
                <div className="flex flex-col items-center space-y-4">
                  <img src="/assets/party.png" alt="Party style" className="object-cover w-full h-40 rounded-md" />
                  <h3 className="text-lg font-medium">Party</h3>
                </div>
              </Link>
              
              <Link to="/category/gym" className="p-6 transition-shadow bg-white rounded-lg hover:shadow-md">
                <div className="flex flex-col items-center space-y-4">
                  <img src="/assets/gym.png" alt="Gym style" className="object-cover w-full h-40 rounded-md" />
                  <h3 className="text-lg font-medium">Gym</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-8 text-2xl font-bold">OUR HAPPY CUSTOMERS</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full">
                  S
                </div>
                <div>
                  <h3 className="font-medium">Sarah M.</h3>
                  <div className="flex text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600">
                "The experience has been great and all of the clothes I've received have been high quality. I've received numerous compliments!"
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full">
                  A
                </div>
                <div>
                  <h3 className="font-medium">Alex K.</h3>
                  <div className="flex text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600">
                "I have been shopping with you for over a year now and I am always impressed with the quality of your products and the range of modern styles at very reasonable prices."
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-purple-500 rounded-full">
                  J
                </div>
                <div>
                  <h3 className="font-medium">James L.</h3>
                  <div className="flex text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600">
                "The customer service has been the best! I was looking for outfits to match a specific occasion and they really came through. The selection of clothes is great with products for all types of styles."
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
