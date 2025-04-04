import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

const categories = [
  { id: "t-shirts", name: "T-shirts" },
  { id: "shirts", name: "Shirts" },
  { id: "jeans", name: "Jeans" },
  { id: "dresses", name: "Dresses" },
  { id: "sweaters", name: "Sweaters" },
  { id: "jackets", name: "Jackets" },
  { id: "shoes", name: "Shoes" },
  { id: "accessories", name: "Accessories" },
];

const ProductFilterSidebar = ({ categories }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handlePriceChange = (values) => {
    setPriceRange(values);
    setSearchParams((params) => {
      params.set("price", values.join(","));
      return params;
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories([categoryId]);
    setSearchParams((params) => {
      params.set("categories", categoryId);
      return params;
    });
  };

  return (
    <div className="w-full md:w-64 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range Filter */}
          <div className="space-y-2">
            <h3 className="font-medium">Price Range</h3>
            <div className="pt-4">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={handlePriceChange}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">${priceRange[0]}</span>
              <span className="text-sm">${priceRange[1]}</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="font-medium">Categories</h3>
            <div className="space-y-2">
              <RadioGroup value={selectedCategories[0]} onValueChange={(value) => handleCategoryChange(value)}> {categories.map((category) => ( <div key={category.id} className="flex items-center space-x-2"> <RadioGroupItem id={`category-${category.id}`} value={category.id} checked={selectedCategories.includes(category.id)} onCheckedChange={() => handleCategoryChange(category.id)} /> <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer"> {category.name} </Label> </div> ))} </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilterSidebar;
