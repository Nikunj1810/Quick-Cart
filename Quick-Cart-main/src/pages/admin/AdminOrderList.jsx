import React from "react";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const ordersData = [
  { id: '#25426', product: 'T-shirt', date: 'Nov 8th,2023', customer: 'Kavin', status: 'Delivered', amount: '₹200.00' },
  { id: '#25425', product: 'Paint', date: 'Nov 7th,2023', customer: 'Komael', status: 'Canceled', amount: '₹200.00' },
  { id: '#25424', product: 'Jens', date: 'Nov 6th,2023', customer: 'Nikhil', status: 'Delivered', amount: '₹200.00' },
];

const AdminOrderList = () => {
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
      
      <Card>
        <div className="p-6 flex justify-between items-center border-b">
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
                <TableRow key={order.id}>
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
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md" disabled>1</Button>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">2</Button>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">3</Button>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">4</Button>
        <span className="flex items-center px-2">...</span>
        <Button variant="outline" className="w-8 h-8 p-0 rounded-md">10</Button>
        <Button variant="outline" className="px-3 rounded-md">NEXT</Button>
      </div>
    </div>
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

export default AdminOrderList;