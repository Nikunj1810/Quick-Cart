import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";
import { User, Package, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../services/orderService";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
  });

  useEffect(() => {
    if (data) {
      // Transform API data to match frontend expectations
      const transformedData = {
        ...data,
        id: data._id,
        customer: {
          name: data.shippingInfo?.fullName || 'Not available',
          email: data.shippingInfo?.email || 'Not available',
          phone: data.shippingInfo?.phone || 'Not available'
        },
        shippingAddress: `${data.shippingInfo?.address || ''}, ${data.shippingInfo?.city || ''}, ${data.shippingInfo?.state || ''} ${data.shippingInfo?.zipCode || ''}`,
        shippingMethod: 'Standard Shipping',
        paymentMethod: data.paymentMethod || 'Not specified',
        createdAt: data.orderDate,
        updatedAt: data.orderDate,
        taxRate: 10,
        taxAmount: data.orderTotal * 0.1,
        subtotal: data.subtotal,
        total: data.orderTotal,
        shippingCost: data.deliveryFee,
        discount: 0,
        status: data.status || 'Pending',
        items: data.items.map(item => ({
          ...item,
          product: {
            _id: item.productId,
            name: item.name || 'Product name not available',
            imageUrl: item.imageUrl
          },
          price: item.price,
          quantity: item.quantity
        }))
      };
      setOrder(transformedData);
      setLoading(false);
    }
    if (isError) {
      setError('Failed to fetch order details');
      setLoading(false);
    }
  }, [data, isError]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found</div>;
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
            <h2 className="text-xl font-bold">Order ID: #{order.id}</h2>
            <span className={`${order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded`}>{order.status}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z" fill="currentColor"/>
              </svg>
              <span className="ml-2 text-sm">{new Date(order.createdAt).toLocaleDateString()} - {new Date(order.updatedAt).toLocaleDateString()}</span>
            </div>
            <Button variant="outline" className="bg-white" onClick={() => window.print()}>
              Print Bill
              <svg width="16" height="16" className="ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 8H5C3.34 8 2 9.34 2 11v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" fill="currentColor"/>
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
              <p className="text-sm">Full Name: {order.customer?.name || 'Not available'}</p>
              <p className="text-sm">Email: {order.customer?.email || 'Not available'}</p>
              <p className="text-sm">Phone: {order.customer?.phone || 'Not available'}</p>
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
              <p className="text-sm">Shipping: {order.shippingMethod}</p>
              <p className="text-sm">Payment Method: {order.paymentMethod}</p>
              <p className="text-sm">Status: {order.status}</p>
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
              <p className="text-sm">Address: {order.shippingAddress}</p>
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
              {order.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                      {item.product?.imageUrl ? (
                        <img 
                          src={`http://localhost:5000${item.product.imageUrl}`} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <span>{item.product?.name || 'Product name not available'}</span>
                  </TableCell>
                  <TableCell>#{item.product?._id || 'N/A'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">₹{item.price * item.quantity}</TableCell>
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
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax ({order.taxRate}%)</span>
                <span>₹{order.taxAmount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Discount</span>
                <span>₹{order.discount || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping Rate</span>
                <span>₹{order.shippingCost || 0}</span>
              </div>
              <div className="flex justify-between py-3 font-bold text-lg border-t mt-2">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminOrderDetails;
