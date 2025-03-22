import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";
import { User, Package, MoreVertical } from "lucide-react";

const orderItems = [
  { id: '#25421', name: 'Lorem Ipsum', quantity: 2, total: '₹800.40' },
  { id: '#25421', name: 'Lorem Ipsum', quantity: 2, total: '₹800.40' },
  { id: '#25421', name: 'Lorem Ipsum', quantity: 2, total: '₹800.40' },
  { id: '#25421', name: 'Lorem Ipsum', quantity: 2, total: '₹800.40' },
];

const AdminOrderDetails = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Order Details</h1>
        <div className="text-sm text-gray-500">
          <Link to="/admin/dashboard" className="hover:underline">Home</Link> &gt;{" "}
          <Link to="/admin/orders" className="hover:underline">Order List</Link> &gt; Order Details
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-6 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Order ID: #6743</h2>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Pending</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z" fill="currentColor"/>
              </svg>
              <span className="ml-2 text-sm">Feb 16, 2022 - Feb 20, 2022</span>
            </div>
            <Button variant="outline" className="bg-white">
              Change Status
              <svg width="16" height="16" className="ml-2" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
              </svg>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="flex">
            <div className="mr-4">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">Customer</h3>
              <p className="text-sm">Full Name: Shristi Singh</p>
              <p className="text-sm">Email: shristi@gmail.com</p>
              <p className="text-sm">Phone: +91 904 231 1212</p>
              <Button variant="outline" size="sm" className="mt-3">View profile</Button>
            </div>
          </div>

          <div className="flex">
            <div className="mr-4">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">Order Info</h3>
              <p className="text-sm">Shipping: Next express</p>
              <p className="text-sm">Payment Method: Paypal</p>
              <p className="text-sm">Status: Pending</p>
              <Button variant="outline" size="sm" className="mt-3">Download info</Button>
            </div>
          </div>

          <div className="flex">
            <div className="mr-4">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">Deliver to</h3>
              <p className="text-sm">Address: Dharam Colony, Palam Vihar, Gurgaon, Haryana</p>
              <Button variant="outline" size="sm" className="mt-3">View profile</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Products</h2>
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
                <TableHead>Product Name</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                    <span>{item.name}</span>
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t p-6">
          <div className="flex justify-end">
            <div className="w-72">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>₹3,201.6</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax (20%)</span>
                <span>₹640.32</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Discount</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping Rate</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between py-3 font-bold text-lg border-t mt-2">
                <span>Total</span>
                <span>₹3,841.92</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminOrderDetails;
