<<<<<<< Updated upstream
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
=======
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrderById(orderId);
        const transformedData = {
          ...data,
          id: data._id,
          customer: {
            name: data.shippingInfo?.fullName || "Not available",
            email: data.shippingInfo?.email || "Not available",
            phone: data.shippingInfo?.phone || "Not available",
          },
          shippingAddress: `${data.shippingInfo?.address || ""}, ${data.shippingInfo?.city || ""}, ${data.shippingInfo?.state || ""} ${data.shippingInfo?.zipCode || ""}`,
          paymentMethod: data.paymentMethod || "Not specified",
          orderDate: data.orderDate,
          status: data.status || "Pending",
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          total: data.orderTotal,
          items: data.items,
        };
        setOrder(transformedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const printInvoice = () => {
    const printContents = document.getElementById("invoice").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Optional: Reload to restore event bindings
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

>>>>>>> Stashed changes
  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={printInvoice}
        className="mb-4 px-4 py-2 bg-black text-white rounded shadow-md"
      >
        Print Invoice
      </button>

      <div
        id="invoice"
        className="bg-white text-black p-8 shadow-md border rounded font-sans"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide mb-1">QuickCart</h1>
          <h2 className="text-xl mb-1">INVOICE</h2>
          <p className="mb-0">Order #: <strong>{order.id}</strong></p>
          <p>Date: <strong>{new Date(order.orderDate).toLocaleDateString()}</strong></p>
          <hr className="my-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-gray-500 mb-2">Customer Information</h3>
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-gray-500 mb-2">Shipping Information</h3>
            <p><strong>Address:</strong> {order.shippingAddress}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        </div>

        <h3 className="mb-3 font-semibold">Ordered Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 mb-6">
            <thead className="bg-gray-100 text-center">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Size</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.size}</td>
                  <td className="p-2 border">₹{item.price.toFixed(2)}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-1/2">
            <h3 className="mb-3 font-semibold">Order Summary</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1"><strong>Subtotal:</strong></td>
                  <td className="py-1 text-right">₹{order.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-1"><strong>Delivery Fee:</strong></td>
                  <td className="py-1 text-right">₹{order.deliveryFee.toFixed(2)}</td>
                </tr>
                <tr className="border-t mt-2">
                  <td className="py-2 font-bold text-lg"><strong>Total:</strong></td>
                  <td className="py-2 text-right font-bold text-lg">₹{order.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p>Thank you for shopping with <strong>QuickCart</strong>!</p>
        </div>
      </div>
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes
    </div>
  );
};

export default AdminOrderDetails;
