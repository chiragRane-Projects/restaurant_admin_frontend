import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Loader2, Car, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { useAuth } from '@/store/useAuth';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not fetch orders");
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update order status");
      toast.success("Order status updated successfully");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'delivered':
        return <Car className="w-5 h-5 text-indigo-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      preparing: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
      ready: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      delivered: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      cancelled: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
    };
    return (
      <Badge className={`flex items-center gap-1 font-medium transition-colors duration-200 ${statusStyles[status]}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl  min-h-screen">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order Management</h2>
          <p className="mt-2 text-gray-500 text-sm">Track and manage your restaurant orders with ease.</p>
        </div>
        <Button
          onClick={fetchOrders}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200"
        >
          Refresh Orders
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg font-medium">No orders found</p>
          <p className="text-gray-400 text-sm mt-2">Check back later or refresh to see new orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <article key={order._id}>
              <Card className="group relative overflow-hidden bg-white border border-gray-100 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex justify-between items-center">
                    <span className="truncate">{order.customer.name}</span>
                    {getStatusBadge(order.status)}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{order.customer.email}</p>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Order ID:</span> {order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Total Amount:</span> ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Payment Mode:</span>{' '}
                      {order.paymentMode.charAt(0).toUpperCase() + order.paymentMode.slice(1)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Order Items</h4>
                    <ul className="list-none space-y-2">
                      {order.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md"
                        >
                          <span>{item.name} (x{item.quantity})</span>
                          <span>₹{item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      onValueChange={(value) => updateOrderStatus(order._id, value)}
                      defaultValue={order.status}
                    >
                      <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Orders;