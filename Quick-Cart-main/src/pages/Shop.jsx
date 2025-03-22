import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProductGrid from "@/components/product/ProductGrid";
import AdminQuickAccess from "@/components/admin/AdminQuickAccess";
import AdminLoginPrompt from "@/components/admin/AdminLoginPrompt";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductFilterSidebar from "@/components/product/ProductFilterSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockProducts = [
  { id: '1', name: 'Awesome T-Shirt', imageUrl: '/path/to/image1.jpg', price: 29.99, category: 'T-Shirt' },
  { id: '2', name: 'Cool Jeans', imageUrl: '/path/to/image2.jpg', price: 59.99, category: 'Jeans' },
  { id: '3', name: 'Stylish Hat', imageUrl: '/path/to/image3.jpg', price: 19.99, category: 'Hat' },
  { id: '4', name: 'Elegant Dress', imageUrl: '/path/to/image4.jpg', price: 79.99, category: 'Dress' },
  { id: '5', name: 'Sporty Shoes', imageUrl: '/path/to/image5.jpg', price: 89.99, category: 'Shoes' },
  { id: '6', name: 'Casual Shirt', imageUrl: '/path/to/image6.jpg', price: 39.99, category: 'Shirt' },
  { id: '7', name: 'Warm Jacket', imageUrl: '/path/to/image7.jpg', price: 99.99, category: 'Jacket' },
  { id: '8', name: 'Comfortable Socks', imageUrl: '/path/to/image8.jpg', price: 9.99, category: 'Socks' },
  { id: '9', name: 'Leather Belt', imageUrl: '/path/to/image9.jpg', price: 24.99, category: 'Belt' },
  { id: '10', name: 'Fancy Scarf', imageUrl: '/path/to/image10.jpg', price: 24.99, category: 'Scarf' },
];

const Shop = () => {
  const { category } = useParams();
  const { isAuthenticated: isAdminAuthenticated } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(mockProducts);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    let filteredProducts = mockProducts;

    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    const priceFilter = searchParams.get('price');
    if (priceFilter) {
      const [minPrice, maxPrice] = priceFilter.split(',').map(Number);
      filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
    }

    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSortBy(sortParam);
      if (sortParam === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortParam === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      }
    } else {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    setProducts(filteredProducts);
  }, [category, searchParams, sortBy]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setSearchParams(params => {
      params.set('price', value.join(','));
      return params;
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setSearchParams(params => {
      params.set('sort', e.target.value);
      return params;
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isAdminAuthenticated && <AdminQuickAccess />}
        
        <div className="flex flex-col md:flex-row gap-6">
          <ProductFilterSidebar />
          
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {category ? `${category} Collection` : "All Products"}
              </h1>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {products.length} products
                </p>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded px-4 py-2 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
      
      {!isAdminAuthenticated && <AdminLoginPrompt />}
    </MainLayout>
  );
};

export default Shop;