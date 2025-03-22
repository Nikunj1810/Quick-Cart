import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Search, Plus, Check } from "lucide-react";
import { getAllProducts, toggleProductChecked, getCheckedProducts } from "@/services/product-service";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
        const checked = await getCheckedProducts();
        setCheckedProducts(checked);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const handleToggleCheck = async (productId) => {
    try {
      const updatedProduct = await toggleProductChecked(productId);
      if (updatedProduct) {
        setProducts(prev =>
          prev.map(p => p.id === productId ? { ...p, checked: updatedProduct.checked } : p)
        );

        if (updatedProduct.checked) {
          setCheckedProducts(prev => [...prev, updatedProduct]);
        } else {
          setCheckedProducts(prev => prev.filter(p => p.id !== productId));
        }

        toast({
          title: updatedProduct.checked ? "Product Checked" : "Product Unchecked",
          description: `${updatedProduct.name} has been ${updatedProduct.checked ? 'added to' : 'removed from'} checked products`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const displayProducts = activeTab === "all"
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : checkedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">All Products</h1>
          <div className="text-sm text-gray-500">
            <Link to="/admin/dashboard" className="hover:underline">Home</Link> &gt; All Products
          </div>
        </div>
        <Button asChild className="rounded-sm">
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            ADD NEW PRODUCT
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="checked">Checked Products ({checkedProducts.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search products by name or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <>
          {displayProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative">
                    <Link to={`/admin/products/${product.id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full aspect-square object-cover object-center"
                      />
                    </Link>
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <div className="bg-white rounded-md p-1.5 shadow-sm">
                        <Checkbox
                          checked={product.checked}
                          onCheckedChange={() => handleToggleCheck(product.id)}
                          className="data-[state=checked]:bg-green-500 border-gray-300"
                        />
                      </div>
                      <button className="bg-white rounded-md p-1.5 shadow-sm">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    {product.checked && (
                      <div className="absolute bottom-3 right-3 bg-green-500 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <Link to={`/admin/products/${product.id}`}>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                        <p className="font-medium mt-1">₹{product.price}</p>
                      </Link>
                    </div>

                    <div>
                      <h4 className="text-sm mb-1">Summary</h4>
                      <p className="text-xs text-gray-500 mb-3">
                        {product.description
                          ? product.description.substring(0, 60) + (product.description.length > 60 ? '...' : '')
                          : 'No description available.'}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Stock</span>
                          <div className="flex items-center gap-1">
                            <span>{product.stock || 0}</span>
                          </div>
                        </div>
                        {product.stock && product.stock > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span>Available</span>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-orange-500 rounded-full"
                                  style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                                ></div>
                              </div>
                              <span>{product.stock}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;
