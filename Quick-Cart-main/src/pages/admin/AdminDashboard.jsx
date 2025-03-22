import React from "react";
import { Link } from "react-router-dom";
import { MoreVertical, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const orderData = [
  { id: '#25426', product: 'Cloth', date: 'Nov 8th,2023', customer: 'Kavin', status: 'Delivered', amount: '₹200.00' },
  { id: '#25425', product: 'T-shirt', date: 'Nov 7th,2023', customer: 'Kamlesh', status: 'Canceled', amount: '₹200.00' },
  { id: '#25424', product: 'Paint', date: 'Nov 6th,2023', customer: 'Nikhil', status: 'Delivered', amount: '₹200.00' },
];

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <div className="text-sm text-gray-500">
          <Link to="/admin/dashboard" className="hover:underline">Home</Link> &gt; Dashboard
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Orders" amount="₹126,500" comparison="Compared to Oct 2023" />
        <StatCard title="Active Orders" amount="₹126,500" comparison="Compared to Oct 2023" />
        <StatCard title="Completed Orders" amount="₹126,500" comparison="Compared to Oct 2023" />
        <StatCard title="Return Orders" amount="₹126,500" comparison="Compared to Oct 2023" />
      </div>
      
      <Card>
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Recent Orders</h2>
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
              {orderData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.id}</TableCell>
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
    </div>
  );
};

const StatCard = ({ title, amount, comparison }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-medium">{title}</h3>
          <button>
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-900 rounded-md flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold">{amount}</p>
            <p className="text-xs text-gray-500">{comparison}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
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

export default AdminDashboard;