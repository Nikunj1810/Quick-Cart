import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

<<<<<<< Updated upstream
const ordersData = [
  { id: '#25426', product: 'T-shirt', date: 'Nov 8th,2023', customer: 'Kavin', status: 'Delivered', amount: '₹200.00' },
  { id: '#25425', product: 'Paint', date: 'Nov 7th,2023', customer: 'Komael', status: 'Canceled', amount: '₹200.00' },
  { id: '#25424', product: 'Jens', date: 'Nov 6th,2023', customer: 'Nikhil', status: 'Delivered', amount: '₹200.00' },
];

const AdminOrderList = () => {
=======
const fetchOrders = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:5000/api/orders?page=${page}&limit=${limit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        status: response.status,
        statusText: response.statusText
      }));
      throw new Error(`Failed to fetch orders: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.orders)) {
      throw new Error("Invalid response format: orders not found.");
    }

    return {
      orders: data.orders.map(order => ({
        id: `#${order._id}`,
        product: order.items?.[0]?.name || "Unknown Product",
        date: new Date(order.orderDate).toLocaleDateString(),
        customer: order.shippingInfo?.fullName || "Unknown",
        status: order.status,
        amount: `₹${order.orderTotal?.toFixed(2) || "0.00"}`
      })),
      totalPages: data.totalPages,
      currentPage: data.currentPage
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const AdminOrderList = () => {
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => fetchOrders(page)
  });

  const orders = data?.orders || [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-md shadow-md space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md text-center">
        <h3 className="text-red-800 font-semibold text-lg">Error loading orders</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

>>>>>>> Stashed changes
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders List</h1>
          <p className="text-sm text-gray-500">
            <Link to="/admin/dashboard" className="hover:underline">Home</Link> &gt; Orders
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white text-sm">Change Status</Button>
        </div>
      </div>
<<<<<<< Updated upstream
      
      <Card>
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Recent Purchases</h2>
          <button>
            <MoreVertical className="h-5 w-5" />
          </button>
=======

      <Card className="shadow-lg">
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Purchases</h2>
          <MoreVertical className="w-5 h-5 text-gray-600" />
>>>>>>> Stashed changes
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"><Checkbox /></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
<<<<<<< Updated upstream
              {ordersData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
=======
              {orders.map(order => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => navigate(`/admin/orders/${order.id.slice(1)}`)}
                >
                  <TableCell onClick={e => e.stopPropagation()}><Checkbox /></TableCell>
>>>>>>> Stashed changes
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
<<<<<<< Updated upstream
      
      <div className="flex justify-center mt-10 gap-2">
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md" disabled>1</Button>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">2</Button>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">3</Button>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">4</Button>
        <span className="flex items-center px-2">...</span>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">10</Button>
        <Button variant="outline" className="px-3 rounded-md">NEXT</Button>
=======

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          &lt;
        </Button>
        {Array.from({ length: Math.min(5, data?.totalPages || 1) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button variant="outline" disabled={page === data?.totalPages} onClick={() => setPage(p => p + 1)}>
          &gt;
        </Button>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
<<<<<<< Updated upstream
  let color = "bg-gray-100";
  
  if (status === "Delivered") {
    color = "text-green-700";
  } else if (status === "Canceled") {
    color = "text-amber-600";
  }
  
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${status === "Delivered" ? "bg-green-700" : "bg-amber-600"}`}></div>
      <span className={color}>{status}</span>
    </div>
  );
};

export default AdminOrderList;
=======
  const statusMap = {
    Delivered: { bg: "bg-green-100", text: "text-green-700" },
    Canceled: { bg: "bg-red-100", text: "text-red-700" },
    Pending: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Processing: { bg: "bg-blue-100", text: "text-blue-700" }
  };
  const { bg, text } = statusMap[status] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {status}
    </span>
  );
};

export default AdminOrderList;
>>>>>>> Stashed changes
