import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProductGrid from "@/components/product/ProductGrid";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductFilterSidebar from "@/components/product/ProductFilterSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const { category } = useParams();
  const { isAuthenticated: isAdminAuthenticated } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('name');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryParam = category ? `&category=${category}` : '';
        const response = await fetch(`http://localhost:5000/api/products?page=${page}&limit=10${categoryParam}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [page, category]);
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    let filteredProducts = products;

    const categoryFilter = searchParams.get('categories');
    if (categoryFilter) {
      const selectedCategories = categoryFilter.split(',');
      filteredProducts = filteredProducts.filter(product => selectedCategories.includes(product.category));
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
  }, [searchParams, products]);

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
          <ProductFilterSidebar categories={categories} />
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
                  className="border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100 transition"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
            <ProductGrid products={products} />
            <div className="flex justify-center mt-4">
              <Button onClick={handleNextPage} disabled={page >= totalPages} className="hover:bg-blue-600 hover:text-white transition">
                Next Page
              </Button>
            </div>
          </div>
        </div>
      </div>
  
    </MainLayout>
  );
};

export default Shop;