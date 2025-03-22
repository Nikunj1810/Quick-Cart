import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { getNewArrivals, getFeaturedProducts } from "@/data/products";

const BrandLogo = ({ name }) => (
  <div className="flex items-center justify-center py-3 grayscale hover:grayscale-0 transition-all">
    <p className="font-bold tracking-wider text-lg">{name}</p>
  </div>
);

const Home = () => {
  const newArrivals = getNewArrivals();
  const topSelling = getFeaturedProducts();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-5 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden h-[600px]">
              <img 
                src="/assets/Hero.png" 
                alt="Fashion models" 
                className="w-full h-full object-cover" 
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
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">
                You can have anything you want in life if you dress for it.
              </h1>
              
              <p className="text-gray-600 text-center text-lg">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
              </p>
              
              <div className="flex justify-center">
                <Button className="bg-black hover:bg-gray-900 text-white px-12 py-3 rounded-full text-lg">
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Brands */}
      <section className="py-1 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
            <img src="/assets/prada.png" alt="prada" className="h-8 mx-auto object-contain" />
            <img src="/assets/mufti.png" alt="Mufti" className="h-14 w-19 mx-auto object-contain" />
            <img src="/assets/vanheusen.png" alt="Van Heusen" className="h-20 w-44 mx-auto object-contain" />
            <img src="/assets/calvin.png" alt="Calvin Klein" className="h-8 mx-auto object-contain" />
            <img src="/assets/gucci.png" alt="Gucci" className="h-12 mx-auto object-contain" />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-8 uppercase text-center">New Arrivals</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/new-arrivals">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Top Selling */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 lowercase">top selling</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {topSelling.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/top-selling">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Browse by Style */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-8">BROWSE BY dress STYLE</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/category/casual" className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center space-y-4">
                  <img src="" alt="Casual style" className="w-full h-40 object-cover rounded-md" />
                  <h3 className="text-lg font-medium">Casual</h3>
                </div>
              </Link>
              
              <Link to="/category/formal" className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center space-y-4">
                  <img src="" alt="Formal style" className="w-full h-40 object-cover rounded-md" />
                  <h3 className="text-lg font-medium">Formal</h3>
                </div>
              </Link>
              
              <Link to="/category/party" className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center space-y-4">
                  <img src="" alt="Party style" className="w-full h-40 object-cover rounded-md" />
                  <h3 className="text-lg font-medium">Party</h3>
                </div>
              </Link>
              
              <Link to="/category/gym" className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center space-y-4">
                  <img src="" alt="Gym style" className="w-full h-40 object-cover rounded-md" />
                  <h3 className="text-lg font-medium">Gym</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">OUR HAPPY CUSTOMERS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
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
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
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
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
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
