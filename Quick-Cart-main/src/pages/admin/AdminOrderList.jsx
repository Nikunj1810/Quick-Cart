import React from "react";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";


const fetchOrders = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:5000/api/orders?page=${page}&limit=${limit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        status: response.status,
        statusText: response.statusText
      }));
      console.error('API Error:', {
        url: response.url,
        status: response.status,
        data: errorData
      });
      throw new Error(`Failed to fetch orders: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.orders || !Array.isArray(data.orders)) {
      throw new Error(`Invalid orders data structure. Received: ${JSON.stringify(data)}`);
    }
    
    // Return both orders and pagination info
    return {
      orders: data.orders.map(order => ({
      id: `#${order._id || ''}`,
      product: order.items?.[0]?.name || 'Unknown',
      date: new Date(order.orderDate).toLocaleDateString(),
      customer: order.shippingInfo?.fullName || 'Unknown',
      status: order.status,
      amount: `₹${order.orderTotal?.toFixed(2) || '0.00'}`
    })),
      totalPages: data.totalPages,
      currentPage: data.currentPage
    };
  } catch (error) {
    console.error('Error fetching orders:', {
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to process orders data: ${error.message}`);
  }
};

const AdminOrderList = () => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, error } = useQuery({ 
    queryKey: ["orders", page], 
    queryFn: () => fetchOrders(page) 
  });
  
  const ordersData = data?.orders || [];

  if (isLoading) return (
  <div className="p-6 space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="animate-pulse flex space-x-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
if (error) return (
  <div className="p-6 bg-red-50 border border-red-200 rounded-md">
    <h3 className="text-red-800 font-medium">Error loading orders</h3>
    <p className="text-red-600 mt-2">{error.message}</p>
    <Button 
      variant="outline" 
      className="mt-4 bg-white"
      onClick={() => window.location.reload()}
    >
      Retry
    </Button>
  </div>
);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Orders List</h1>
          <div className="text-sm text-gray-500">
            <Link to="/admin/dashboard" className="hover:underline">Home</Link> &gt; Order List
          </div>
        </div>
        <div className="flex items-center">
          <div className="border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 bg-white">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z" fill="currentColor"/>
              </svg>
              <span>Feb 16,2022 - Feb 20,2022</span>
            </div>
          </div>
          <div className="ml-2">
            <Button variant="outline" className="bg-white">
              Change Status
              <svg width="16" height="16" className="ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="border-0 shadow-lg">
        <div className="p-6 flex justify-between items-center border-b bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold">Recent Purchases</h2>
          <button>
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>
                    <Link to={`/admin/orders/${order.id.substring(1)}`} className="hover:underline">
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <div className="flex justify-center mt-10 gap-2">
        <Button 
          variant="outline" 
          className="w-8 h-8 p-0 rounded-md" 
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          &lt;
        </Button>
        
        {Array.from({ length: Math.min(5, data?.totalPages || 1) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              className="w-8 h-8 p-0 rounded-md"
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button 
          variant="outline" 
          className="w-8 h-8 p-0 rounded-md" 
          disabled={page === data?.totalPages}
          onClick={() => setPage(p => Math.min(data?.totalPages || 1, p + 1))}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";
  
  if (status === "Delivered") {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
  } else if (status === "Canceled") {
    bgColor = "bg-red-100";
    textColor = "text-red-700";
  } else if (status === "Pending") {
    bgColor = "bg-amber-100";
    textColor = "text-amber-700";
  } else if (status === "Processing") {
    bgColor = "bg-blue-100";
    textColor = "text-blue-700";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default AdminOrderList